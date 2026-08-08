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
  Screenshot: "Optional — add any extra text or context not visible in the screenshot…",
};

const LABELS = {
  Message: "Message content",
  Email: "Email content",
  Url: "URL to check",
  Screenshot: "Extra context (optional)",
};

export default function AnalyzeForm({ onAnalyze, isLoading }) {
  const [inputType, setInputType] = useState("Message");
  const [content, setContent] = useState("");
  const [secondaryContent, setSecondaryContent] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const fileInputRef = useRef(null);
  const pasteAreaRef = useRef(null);
  const formRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const hasImage = inputType === "Screenshot" && imageDataUrl;
    if (!content.trim() && !hasImage) return;

    const payload = {
      inputType,
      content: content.trim(),
      secondaryContent: secondaryContent.trim() || undefined,
    };

    if (hasImage) {
      const [header, base64] = imageDataUrl.split(",");
      const mimeMatch = header.match(/data:(.*);base64/);
      payload.imageBase64 = base64;
      payload.imageMimeType = mimeMatch ? mimeMatch[1] : "image/png";
    }

    onAnalyze(payload);
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
          if (file) attachImage(file);
          e.preventDefault();
          return;
        }
      }
    }

    const node = pasteAreaRef.current;
    node?.addEventListener("paste", handlePaste);
    return () => node?.removeEventListener("paste", handlePaste);
  }, [inputType]);

  useEffect(() => {
    function handleRequestScreenshot() {
      setInputType("Screenshot");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      fileInputRef.current?.click();
    }

    window.addEventListener("request-screenshot-upload", handleRequestScreenshot);
    return () => window.removeEventListener("request-screenshot-upload", handleRequestScreenshot);
  }, []);

  async function attachImage(file) {
    setImageLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageDataUrl(ev.target.result);
      setImageName(file.name || "image");
      setInputType("Screenshot");
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    attachImage(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDraggingImage(false);
    if (inputType !== "Screenshot") return;

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      attachImage(file);
    }
  }

  return (
    <form className="analyze-form card" onSubmit={handleSubmit} ref={formRef}>
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
          required={inputType !== "Screenshot"}
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
                  Add a screenshot of a message, email, or login page. The AI reads the text directly
                  from the image — no need to retype it.
                </p>
              </div>

              <div className="image-upload-actions">
                <button
                  type="button"
                  className="btn-primary image-upload-button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                  aria-disabled={imageLoading}
                >
                  {imageLoading ? "Loading…" : "Choose image"}
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
                    <span className="image-preview-badge">Ready to analyze</span>
                  </div>
                  <p>
                    We will send this image to the AI so it can read the text itself. Add any extra
                    context below if you like, then tap analyze.
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

      <button
        type="submit"
        className="btn-primary"
        disabled={isLoading || (!content.trim() && !(inputType === "Screenshot" && imageDataUrl))}
      >
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
