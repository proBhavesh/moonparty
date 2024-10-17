import os


def extract_content(src_path, output_file):
    with open(output_file, "w", encoding="utf-8") as out_file:
        for root, dirs, files in os.walk(src_path):
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, src_path)

                out_file.write(f"File: {relative_path}\n")
                out_file.write("Content:\n")

                try:
                    with open(file_path, "r", encoding="utf-8") as in_file:
                        content = in_file.read()
                        out_file.write(content)
                except Exception as e:
                    out_file.write(f"Error reading file: {str(e)}")

                out_file.write("\n\n" + "=" * 50 + "\n\n")


if __name__ == "__main__":
    src_folder = "./src"
    output_file = "nextjs_content.txt"

    extract_content(src_folder, output_file)
    print(f"Content extracted and saved to {output_file}")
