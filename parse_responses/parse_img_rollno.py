import csv
import os
from shutil import copyfile

# Given downloaded images (from google drive)
# Image names are given as {some text} - {name}.webp
#   (name of google account, can fetch from google sheets chips)
# given them to {photo|meme|gang}_rollno.webp

# Move images to the photo/ meme/ gang/ directories
# get the chip_names.csv file containing the rollno and name

# First, convert all images to webp
# In each directory, run: (requires imagemagick)
#   `mogrify -format webp *.{jfif,jpeg,jpg,png,PNG}`

# First line is header
# Row format is [_, email, chip_name, ...]
with open("./chip_names.csv") as f:
    reader = csv.reader(f)
    rows = list(reader)[1:]

name_to_rollno = {row[2]: row[1].split("@")[0] for row in rows}

for curr_dir in ["photo", "meme", "gang"]:
    for filename in os.listdir(curr_dir):
        if len(filename.split(" - ")) < 1:
            print(f"Error: {curr_dir}/{filename}")
            continue

        # _should_ correctly give the name
        name = filename.rsplit(" - ", 1)[1]
        name = name.rsplit(".", 1)[0]
        if name not in name_to_rollno:
            print(f"Error: {curr_dir}/{filename}")
            continue
        rollno = name_to_rollno[name]

        old_path = os.path.join(curr_dir, filename)
        new_path = os.path.join("imgs", f"{curr_dir}_{rollno}.webp")
        copyfile(old_path, new_path)
