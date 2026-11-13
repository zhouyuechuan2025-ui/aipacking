export type CodeEditorTimingInput = {
  code?: string;
  reveal?: "static" | "type" | "lines";
  charactersPerFrame?: number;
  framesPerLine?: number;
  holdDurationInFrames?: number;
};

export const calculateCodeEditorDuration = ({
  code = "",
  reveal = "lines",
  charactersPerFrame = 2,
  framesPerLine = 10,
  holdDurationInFrames = 45,
}: CodeEditorTimingInput) => {
  const animation =
    reveal === "static"
      ? 1
      : reveal === "type"
        ? Math.ceil(code.length / Math.max(0.1, charactersPerFrame))
        : Math.max(1, code.split("\n").length) * Math.max(1, framesPerLine);
  return Math.max(1, animation + Math.max(0, holdDurationInFrames));
};
