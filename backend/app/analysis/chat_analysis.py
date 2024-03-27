import io
from collections import Counter
from typing import List, Tuple
import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
from itertools import chain
from urllib.parse import urlparse
import uuid
import datetime

# Assuming 'chatParser.py' contains the 'parse_chat_to_df' function
from .chat_parser import parse_chat_to_df

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('stopwords')

stop_words = set(stopwords.words('english'))
analysis_storage = {}

# Extract domain from URL
def extract_domain(url: str) -> str:
    """Extracts the domain from a given URL."""
    return url
    # try:
    #     parsed_url = urlparse(url)
    #     return parsed_url.netloc.replace("www.", "")  # Normalize by removing 'www'
    # except Exception as e:
    #     print(f"Error extracting domain from URL '{url}': {e}")
    #     return ""

# Tokenize and filter messages to find the most used words
def most_used_words(messages: List[str]) -> List[Tuple[str, int]]:
    """Returns the 10 most common words from a list of messages, excluding stopwords."""
    # words = word_tokenize(" ".join(messages).lower())
    # filtered_words = [word for word in words if word.isalpha() and word not in stop_words]
    # return Counter(filtered_words).most_common(10)
    words = word_tokenize(" ".join(messages).lower())
    filtered_words = [word for word in words if word.isalpha() and word not in stop_words]
    common_words = Counter(filtered_words).most_common(10)
    total_count = len(filtered_words)
    return common_words, total_count

# Find the most used emojis for each author
def most_used_emojis(emojis_list: List[List[str]]) -> List[Tuple[str, int]]:
    """Returns the 5 most common emojis from a list of emoji lists."""
    all_emojis = list(chain.from_iterable(emojis_list))
    # return Counter(all_emojis).most_common(5)
    common_emojis = Counter(all_emojis).most_common(5)
    total_count = len(all_emojis)
    return common_emojis, total_count


# Identify favorite domains for each author
def favorite_domains(urls_list: List[List[str]]) -> List[Tuple[str, int]]:
    """Returns the 5 most common domains from a list of URL lists."""
    all_domains = [extract_domain(url) for url in chain.from_iterable(urls_list)]
    # return Counter(all_domains).most_common(5)
    common_domains = Counter(all_domains).most_common(5)
    total_count = len(all_domains)
    return common_domains, total_count


def find_conversation_initiators(df: pd.DataFrame) -> pd.Series:
    df_sorted = df.sort_values('Timestamp')
    df_sorted['Timestamp'] = pd.to_datetime(df_sorted['Timestamp'])
    # Assume a new conversation starts after a 1-hour gap
    df_sorted['Time_Diff'] = df_sorted['Timestamp'].diff().dt.total_seconds().div(3600, fill_value=0)
    conversation_starts = df_sorted[df_sorted['Time_Diff'] > 1]
    initiators = conversation_starts['Author'].value_counts()
    return initiators

def message_activity_per_hour(df: pd.DataFrame) -> pd.DataFrame:
    df['Hour'] = df['Timestamp'].dt.hour
    activity = df.groupby(['Author', 'Hour']).size().unstack(fill_value=0)
    return activity

def message_activity_per_hour(df: pd.DataFrame) -> pd.DataFrame:
    df['Hour'] = df['Timestamp'].dt.hour
    activity = df.groupby(['Author', 'Hour']).size().unstack(fill_value=0)
    return activity

def count_attachments(df: pd.DataFrame) -> pd.Series:
    attachments = df[df['MessageType'] == 'Attachment']['Author'].value_counts()
    return attachments

# def analyze_chat(file_stream):
#     lines = file_stream.read().decode("utf-8").splitlines()
    
#     df = parse_chat_to_df(lines)

#     # Most used words per author
#     most_used_words_per_author = df[df['MessageType'] == 'Chat'].groupby('Author')['Message'].apply(most_used_words).reset_index()

#     # Most used emojis per author
#     most_used_emojis_per_author = df.groupby('Author')['Emojis'].apply(most_used_emojis).reset_index()

#     # Favorite domains per author
#     favorite_domains_per_author = df.groupby('Author')['URLs'].apply(favorite_domains).reset_index()

#     conversation_initiators = find_conversation_initiators(df)
#     activity_per_hour = message_activity_per_hour(df)
#     attachments_count = count_attachments(df)
#     results = {
#         "most_used_words_per_author": most_used_words_per_author.to_dict(orient='records'),
#         "most_used_emojis_per_author": most_used_emojis_per_author.to_dict(orient='records'),
#         "favorite_domains_per_author": favorite_domains_per_author.to_dict(orient='records'),
#         "conversation_initiators": conversation_initiators.to_dict(),
#         "activity_per_hour": activity_per_hour.to_dict("index"),
#         "attachments_count": attachments_count.to_dict()
#     }

#     analysis_id = save_analysis_results(results)
#     return {"analysis_uid": analysis_id}

def analyze_chat(file_stream):
    lines = file_stream.read().decode("utf-8").splitlines()
    
    df = parse_chat_to_df(lines)

    # Extract unique authors from the DataFrame
    author_list = df['Author'].unique().tolist()

    # Most used words per author
    words_data = df[df['MessageType'] == 'Chat'].groupby('Author')['Message'].apply(lambda x: most_used_words(x)).to_dict()
    most_used_words_per_author = {author: {"common_words": data[0], "total_count": data[1]} for author, data in words_data.items()}

    # Most used emojis per author
    emojis_data = df.groupby('Author')['Emojis'].apply(lambda x: most_used_emojis(x)).to_dict()
    most_used_emojis_per_author = {author: {"common_emojis": data[0], "total_count": data[1]} for author, data in emojis_data.items()}

    # Favorite domains per author
    domains_data = df.groupby('Author')['URLs'].apply(lambda x: favorite_domains(x)).to_dict()
    favorite_domains_per_author = {author: {"common_domains": data[0], "total_count": data[1]} for author, data in domains_data.items()}

    total_message_count_per_author = df['Author'].value_counts().to_dict()

    conversation_initiators = find_conversation_initiators(df)
    activity_per_hour = message_activity_per_hour(df)
    attachments_count = count_attachments(df)

    results = {
        "most_used_words_per_author": most_used_words_per_author,
        "most_used_emojis_per_author": most_used_emojis_per_author,
        "favorite_domains_per_author": favorite_domains_per_author,
        "conversation_initiators": conversation_initiators.to_dict(),
        "activity_per_hour": activity_per_hour.to_dict("index"),
        "attachments_count": attachments_count.to_dict(),
        "author_list": author_list,
        "total_message_count_per_author": total_message_count_per_author,
    }

    analysis_id = save_analysis_results(results)
    return {"analysis_uid": analysis_id}


def save_analysis_results(results):
    unique_id = str(uuid.uuid4())
    current_timestamp = datetime.datetime.now()
    analysis_storage[unique_id] = (results, current_timestamp)
    return unique_id

# Function to retrieve results using a UUID
def get_analysis_results(unique_id):
    result_entry = analysis_storage.get(unique_id)
    if result_entry is None:
        return "No data found for the given UUID."
    results, _ = result_entry
    return results

def clear_old_data():
    current_time = datetime.datetime.now()
    keys_to_delete = [key for key, (_, timestamp) in analysis_storage.items()
                      if current_time - timestamp > datetime.timedelta(hours=2)]
    for key in keys_to_delete:
        del analysis_storage[key]




if __name__ == "__main__":
    # Set of English stopwords
    stop_words = set(stopwords.words('english'))

    # Read chat data
    with io.open("data/_chat.txt", "r", encoding="utf-8") as file:
        lines = file.readlines()

    # Parse chat data into DataFrame
    df = parse_chat_to_df(lines)

    # Most used words per author
    most_used_words_per_author = df[df['MessageType'] == 'Chat'].groupby('Author')['Message'].apply(most_used_words).reset_index()

    # Most used emojis per author
    most_used_emojis_per_author = df.groupby('Author')['Emojis'].apply(most_used_emojis).reset_index()

    # Favorite domains per author
    favorite_domains_per_author = df.groupby('Author')['URLs'].apply(favorite_domains).reset_index()

    conversation_initiators = find_conversation_initiators(df)
    activity_per_hour = message_activity_per_hour(df)
    attachments_count = count_attachments(df)


    # Print results
    print(df.head(10))
    print(most_used_words_per_author)
    print(most_used_emojis_per_author)
    print(favorite_domains_per_author)
    
    print("Conversation Initiators:\n", conversation_initiators)
    print("\nMessage Activity Per Hour:\n", activity_per_hour)
    print("\nAttachments Count:\n", attachments_count)

