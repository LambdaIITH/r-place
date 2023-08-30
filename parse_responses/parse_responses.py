# Read yearbook_responses.csv and write users.csv and hostel.csv
# users.csv and hostel.csv are in the schema of the database and can be directly imported

import csv
import json
import regex
from typing import Tuple, Union

responses = {}
with open('yearbook_responses.csv', 'r') as f:
    reader = csv.reader(f)
    # read all rows
    responses = [row for row in reader]

header = responses[0]
responses = responses[1:]

# (letter)(optional whitespace)(optional -)(optional whitespace)(3 digits)
# lookbehind to avoid matching A-110 in CHARAKA-110
full_regex = regex.compile(r"(?<![A-Z])[A-Z]\s*-?\s*[0-9]{3}")
hostel_letters = {
    "ARYABHATTA": "A",
    "BHASKARA": "B",
    "CHARAKA": "C",
    "SUSRUTA": "D",
    "KAUTILYA": "E",
    "VYASA": "F",
    "BRAHMAGUPTA": "G",
    "VARAHAMIHIRA": "H",
    "MAITREYI": "I",
    "GARGI": "J",
}
names_str = "(" + "|".join(name for name in hostel_letters) + ")"
names_regex = regex.compile(names_str)
num_regex = regex.compile(r"[0-9]{3}")


def parse_room(room: str) -> Union[Tuple[str, int, int], None]:
    room = room.upper()
    full = full_regex.findall(room, overlapped=True)
    name = names_regex.findall(room, overlapped=True)
    num = num_regex.findall(room, overlapped=True)
    if len(full) == 1:
        full = full[0]
        hostel = full[0]
        floor = int(full[-3])
        roomno = int(full[-2:])
        return hostel, floor, roomno
    else:
        if len(name) != 1 or len(num) != 1:
            return None
        num = num[0]

        hostel = hostel_letters[name[0]]
        floor = int(num[0])
        roomno = int(num[1:])
        return hostel, floor, roomno


def parse_row(row, i) -> Tuple[list, Union[list, None]]:
    # FIXME: for future re-users, row numbers are hardcoded

    email = row[1].strip()
    name = row[2].strip()
    room = parse_room(row[3])
    quote = row[14].strip()

    # questions with text responses
    texts = [5, 6, 7, 8, 9, 11, 14, 15, 16, 17]
    # questions with image responses
    images = [10, 12, 13]
    texts = {header[i]: row[i].strip() for i in texts}
    images = {header[i]: row[i].strip() for i in images}

    users_row = [name, email]

    if room is None:
        print(f"Roomless: {i+2:03d}: {email:25} {name}")
        hostel_row = None
    else:
        hostel_row = [room[0], room[1], room[2], email, quote, json.dumps(
            {"texts": texts, "images": images}, ensure_ascii=False)]
    return users_row, hostel_row


with open('users.csv', 'w') as users, open('hostel.csv', 'w') as hostel:
    users_writer = csv.writer(users)
    hostel_writer = csv.writer(hostel)

    for i, row in enumerate(responses):
        users_row, hostel_row = parse_row(row, i)
        users_writer.writerow(users_row)
        if hostel_row is not None:
            hostel_writer.writerow(hostel_row)

# row1 = responses[0]
# print(json.dumps(header))
# print(json.dumps(parse_row(row1, 0), indent=4, ensure_ascii=False))
