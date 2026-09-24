

# <class 'pandas.DataFrame'>
# Index: 2013303 entries, 249969 to 763804
# Data columns (total 13 columns):
#  #   Column                   Dtype  
# ---  ------                   -----  
#  0   step                     int64  
#  1   amount                   float64
#  2   oldbalanceOrg            float64
#  3   newbalanceOrig           float64
#  4   oldbalanceDest           float64
#  5   newbalanceDest           float64
#  6   hour                     int64  
#  7   is_night                 int64  
#  8   sender_balance_change    float64
#  9   receiver_balance_change  float64
#  10  orig_balance_zero        Int64  
#  11  dest_balance_zero        int64  
#  12  type_TRANSFER            int64  
# dtypes: Int64(1), float64(7), int64(5)
# memory usage: 217.0 MB

# data we need to generate:
# 2.Hour int64
# 3.is_night int64
# 4.orig_balance_zero int64
# 5.dest_balance_zero int64
def Feature_engineering(transaction_df):
    transaction_df["hour"] = transaction_df["step"] % 24
    transaction_df["is_night"] = transaction_df["hour"].apply(lambda x: 1 if x < 6 else 0) 
    transaction_df['orig_balance_zero'] = (transaction_df['oldbalanceOrg'] == 0).astype('Int64')
    transaction_df['dest_balance_zero'] = (transaction_df['oldbalanceDest'] == 0).astype("int64")
    return transaction_df

    