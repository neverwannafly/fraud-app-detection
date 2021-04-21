from utils import db
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import re
from collections import Counter
import json
import sys

# nltk.download('vader_lexicon')
# nltk.download("punkt")

def generate_report(app_id):
  reviews_table = db()['reviews']
  reviews = [r for r in reviews_table.find({ 'appId': app_id })]

  sia = SentimentIntensityAnalyzer()

  analysed_reviews = []

  def normalize(data):
    url_pattern = re.compile(r'https?://\S+|www\.\S+')
    data = url_pattern.sub(r'', data)
    data = re.sub('\S*@\S*\s?', '', data)
    data = re.sub('\s+', ' ', data)
    data = re.sub("\'", "", data)
          
    return data

  def analyse_review(review):
    score_c = score_t = { 'neg': 0, 'neu': 1, 'pos': 0, 'compound': 0 }

    if review.get('title'):
      score_t = sia.polarity_scores(normalize(review['title']))

    if review.get('content'):
      score_c = sia.polarity_scores(normalize(review['content']))

    title_coeff = 0.05
    content_coeff = 0.95

    merged_score = {}

    for key in score_c:
      merged_score[key] = title_coeff * float(score_t[key]) + content_coeff * float(score_c[key])

    merged_score['compound'] = (merged_score['compound'] + review.get('rating', 2.5) - 2.5) * min(review.get('voteCount', 1), 1)

    return merged_score

  for r in reviews:
    score = analyse_review(r)
    analysed_reviews.append({ str(r['_id']): score })

  sorted_analysed_reviews = sorted(analysed_reviews, key=lambda k: list(k.values())[0]['compound']) 
  labels = []

  for sar in sorted_analysed_reviews:
    compound = list(sar.values())[0]['compound']
    if (compound <= -0.5):
      labels.append("Terrible")
    elif (-0.5 < compound < -0.05):
      labels.append("Bad")
    elif (- 0.05 < compound < 0.05):
      labels.append("Satisfactory")
    elif (0.05 < compound < 0.5):
      labels.append("Good")
    elif (compound >= 0.5):
      labels.append("Excellent")

  return {
    'bad_reviews': json.dumps(sorted_analysed_reviews[0:10]),
    'good_reviews': json.dumps(sorted_analysed_reviews[-10:]),
    'verdict': Counter(labels).most_common(1)[0][0],
  }

app_id = sys.argv[1]
if app_id is None:
  sys.stdout.write(json.dumps({ "success": False }))

report = generate_report(app_id)
sys.stdout.write(json.dumps({
  "success": True,
  "report": report,
}))