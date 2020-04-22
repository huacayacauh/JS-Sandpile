import re
from glob import glob

files = glob("./js/**/*.js", recursive=True)

final_string = ""

for file in files:
    if "query" in file:
        # do not look in jquery
        continue
    file_indexing = ""
    with open(file, "r") as f:
        lines = f.readlines()

    index = False
    for line in lines:
        if not index:
            # Look for the beginning of an indexing
            begin = re.match("(?!\w+)\s*//(?!\s*\w)(\s*\[.*\d+\.\d+.*\].*|.*\[.*\d+.*\].*)", line)
            if begin:
                if "Something" in begin.group(1):
                    # Don't take into account the explanations at the beginning of the files
                    continue
                index = True
                file_indexing += "###" + begin.group(1) + "\n"
                continue

        if index:
            # Look for the end of an indexing
            end = re.match("(?!//)", line)
            if end:
                index = False
                file_indexing += "\n"
                continue
            match = re.match(".*//(.*)", line)
            if "####" not in match.group(1) and "------" not in match.group(1):
                # Ugly
                file_indexing += "> " + match.group(1) + "\n"

    if len(file_indexing) > 0:
        final_string += "# " + re.match(r'.*\\(.*)\.js', file).group(1) + "\n"
        final_string += file_indexing + "\n"

with open("Indexing.txt", "w") as f:
    f.write(final_string)
