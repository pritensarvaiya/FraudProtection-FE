import { useState, useRef, useEffect } from "react";

const INPUT_TYPES = [
  { value: "Message", label: "Message" },
  { value: "Email", label: "Email" },
  { value: "Url", label: "URL" },
  { value: "Screenshot", label: "Screenshot" },
];

const PLACEHOLDERS = {
  Message: "Paste the suspicious SMS or WhatsApp message here…",
  Email: "Paste the full email content, including the subject line…",
  Url: "https://suspicious-link.example.com/login",
  Screenshot: "Paste the text you read from the screenshot…",
};

const LABELS = {
  Message: "Message content",
  Email: "Email content",
  Url: "URL to check",
  Screenshot: "Text from the screenshot",
};

export default function AnalyzeForm({ onAnalyze, isLoading }) {
  const [inputType, setInputType] = useState("Message");
  const [content, setContent] = useState("");
  const [secondaryContent, setSecondaryContent] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [imageName, setImageName] = useState("");
  const [ocrRunning, setOcrRunning] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const fileInputRef = useRef(null);
  const pasteAreaRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    const submitSecondary = secondaryContent && !secondaryContent.startsWith("data:")
      ? secondaryContent.trim()
      : undefined;

    onAnalyze({
      inputType,
      content,
      secondaryContent: submitSecondary,
    });
  }

  useEffect(() => {
    // paste handler for images from clipboard
    function handlePaste(e) {
      if (inputType !== "Screenshot") return;
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type && item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) readFileAndRunOcr(file);
          e.preventDefault();
          return;
        }
      }
    }

    const node = pasteAreaRef.current;
    node?.addEventListener("paste", handlePaste);
    return () => node?.removeEventListener("paste", handlePaste);
  }, []);

  async function readFileAndRunOcr(file) {
    // Quick path: do not run OCR here (slow). Attach image data URL into secondaryContent
    // so the backend (or future worker) can process it. Keep UI responsive.
    setOcrRunning(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setImageDataUrl(dataUrl);
      setImageName(file.name || "image");
      // set a helpful placeholder so users know to paste/type extracted text if desired
      if (!content) setContent("(Image attached — paste or type the text you read from the screenshot here)");
      setInputType("Screenshot");
      // Keep the image only locally (preview). Do NOT store base64 in `secondaryContent` —
      // including it in the analyze JSON payload makes requests very large and slow.
      setOcrRunning(false);
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    readFileAndRunOcr(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDraggingImage(false);
    if (inputType !== "Screenshot") return;

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      readFileAndRunOcr(file);
    }
  }

  return (
    <form className="analyze-form card" onSubmit={handleSubmit}>
      <div className="form-head">
        <h2>Check something suspicious</h2>
        <p>Get an explainable risk assessment in seconds.</p>
      </div>

      <div className="field-group">
        <label htmlFor="content-input">Input type</label>
        <div className="segmented" role="group" aria-label="Input type">
          {INPUT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={inputType === t.value ? "active" : ""}
              aria-pressed={inputType === t.value}
              onClick={() => setInputType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="content-input">{LABELS[inputType]}</label>
        <textarea
          id="content-input"
          ref={pasteAreaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={PLACEHOLDERS[inputType]}
          required
        />
        {content.length > 0 && (
          <p className="field-hint">{content.length.toLocaleString()} characters</p>
        )}

        {inputType === "Screenshot" && (
          <>
            <div
              className={`image-upload-zone${isDraggingImage ? " is-dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                if (inputType === "Screenshot") setIsDraggingImage(true);
              }}
              onDragLeave={() => setIsDraggingImage(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                id="image-input"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <div className="image-upload-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5-5 5 5" />
                  <path d="M12 5v12" />
                </svg>
              </div>

              <div className="image-upload-copy">
                <span className="image-upload-kicker">Screenshot input</span>
                <strong>Drop an image, paste one, or choose a file</strong>
                <p>
                  Add a screenshot of a message, email, or login page. We will keep it local for preview,
                  so the analyze request stays fast.
                </p>
              </div>

              <div className="image-upload-actions">
                <button
                  type="button"
                  className="btn-primary image-upload-button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={ocrRunning}
                  aria-disabled={ocrRunning}
                >
                  {ocrRunning ? "Processing…" : "Choose image"}
                </button>
                <span className="image-upload-hint">Ctrl+V also works in the text box below</span>
              </div>
            </div>

            {imageDataUrl && (
              <div className="image-preview-card">
                <div className="image-preview-thumb-wrap">
                  <img src={imageDataUrl} alt="Selected screenshot preview" className="image-preview-thumb" />
                </div>
                <div className="image-preview-meta">
                  <div className="image-preview-topline">
                    <strong>{imageName || "Image attached"}</strong>
                    <span className="image-preview-badge">Ready</span>
                  </div>
                  <p>
                    Screenshot attached. Review the text area below, then tap analyze.
                  </p>
                  <div className="image-preview-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setImageDataUrl(null);
                        setImageName("");
                      }}
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="secondary-input">
          Sender or extra context <span style={{ fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id="secondary-input"
          type="text"
          value={secondaryContent}
          onChange={(e) => setSecondaryContent(e.target.value)}
          placeholder="e.g. sender@example.com or +91 98765 43210"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading || !content.trim()}>
        {isLoading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Analyzing…
          </>
        ) : (
          "Analyze for fraud risk"
        )}
      </button>
    </form>
  );
}
