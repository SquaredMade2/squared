const styles = {
  editorPlaceholder:
    'text-gray-400 absolute top-6 left-14 text-base select-none inline-block pointer-events-none',
};

export function PlaceholderPlugin({
  placeholderText,
}: {
  placeholderText: string;
}): React.ReactElement {
  return <div className={styles.editorPlaceholder}>{placeholderText}</div>;
}
