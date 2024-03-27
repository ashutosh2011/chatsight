
with open('data/_chat.txt') as f:
    # Read the file
    chats = f.read()

from collections import defaultdict

# Split the chat into individual messages
messages = chats.strip().split('\n')

# Initialize a dictionary to store the count of messages for each user
message_count = defaultdict(int)

print(len(messages))

import re

# Improved logic to extract sender's name and count messages
# Using regex to find patterns that match the sender's name format
pattern = re.compile(r'\[(\d{2}/\d{2}/\d{2},\s\d{1,2}:\d{2}:\d{2}\s[AP]M)\]\s(.*?):')
word_count = defaultdict(int)
# Extract senders and their message counts
message_count = defaultdict(int)
for message in messages:
    match = pattern.search(message)
    if match:
        sender = match.group(2)
        message_count[sender] += 1
        message_text = message[match.end():].strip()
        # Count the words in the message
        word_count[sender] += len(message_text.split())



print(message_count)
print(word_count)