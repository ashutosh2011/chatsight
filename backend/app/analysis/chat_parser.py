import pandas as pd
from patterns import BAD_CHARS, IS_STARTING_LINE, IS_URL, IS_CHAT, IS_EVENT, IS_ATTACHMENT,IS_DELETED_CHAT
import re
from dateutil import parser
import emoji

def remove_bad_chars(line):
    for char in BAD_CHARS:
        line = line.replace(char, '')
    return line

def contains_attachment(body=""):
    for p in IS_ATTACHMENT:
        if re.match(p, body):
            return body
    return None

def is_deleted(body=""):
    for p in IS_DELETED_CHAT:
        match = re.match(p, body)
        if match:
            return body
    return None

def is_event(body=""):
    for p in IS_EVENT:
        match = re.match(p, body)
        if match:
            return match
    return None

# Parse the body of a chat message
def parse_body(body="", following=False):
    chat = re.match(re.compile(IS_CHAT, re.VERBOSE), body)
    author, message_body, message_type, domains, emojis = None, "", "", [], []
    if chat or following:
        message_type = "Chat"
        message_body = body
        if not following:
            author = chat.group(1)
            message_body = chat.group(3)

        has_attachment = contains_attachment(message_body)
        if has_attachment:
            # Set chat type to attachment
            message_type = "Attachment"
        else:
            if is_deleted(message_body):
                message_type = "Deleted"
            else:
                urls = re.findall(IS_URL, message_body)
                domains = []
                if urls:
                    for url in urls:
                        domain = url[0].replace("http://", '')
                        domain = domain.replace("https://", '')
                        domain = domain.split("/")
                        domains.append(domain[0])
                emojis = [c["emoji"] for c in emoji.emoji_list(message_body)]

    elif is_event(body):
        # Set line_type
        message_type = "Event"
    
    return author, message_body, message_type, domains, emojis

# Parse a line of chat

def parse_line(line):
    line = remove_bad_chars(line)
    starting_line = re.match(re.compile(IS_STARTING_LINE, re.VERBOSE), line)
    if starting_line:
        timestamp = parser.parse(starting_line.group(2))
        body = starting_line.group(18)
        author, message, message_type, urls, emojis = parse_body(body, False)
    else:
        timestamp = None
        author, message, message_type, urls, emojis = parse_body(line,True)
    return timestamp, author, message, message_type, urls, emojis

def parse_chat_to_df(lines):
    data = []
    for line in lines:
        timestamp, author, message, message_type, urls,emojis = parse_line(line)
        if timestamp:
            data.append([timestamp, author, message, message_type, urls, emojis])
        elif data:
            data[-1][2] += " " + message  # Append the continuation line to the last message's content
            data[-1][4].extend(urls)  # Append the continuation line to the last message's content
            data[-1][5].extend(emojis)  # Append the continuation line to the last message's content
    return pd.DataFrame(data, columns=['Timestamp', 'Author', 'Message', 'MessageType', 'URLs', 'Emojis'])
