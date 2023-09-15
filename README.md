# Sample AWS Application

## Architecture
Very simple and straightforward architecture : We have a webpage to do some math calculation, hosted on **AWS AMPLIFY**. Upon entering the data, we send it to the lambda function to compute it. The result is then stored in a DynamoDB instance.

![diagram](AWS-diagram.png)

## Lambda function code :
```python
import json
import math
import random

# import the AWS SDK (for Python the package name is boto3)
import boto3
from time import gmtime, strftime

client = boto3.client('dynamodb')
now = strftime("%a, %d %b %Y %H:%M:%S +0000", gmtime())
MAX_ID_SIZE = 1000

def lambda_handler(event, context):
    # math result
    mathResult = math.pow(int(event['base']), int(event['exponent']))
    # ID generation
    id = random.randint(0,MAX_ID_SIZE)
    
    # Check ID unicity 
    while(
        client.scan(
            TableName="math",
            ExpressionAttributeValues={
            ':id': {
                'S': str(id),
                }
            },
            FilterExpression='ID = :id',
        )['Count'] != 0
    ):
        id = random.randint(0,MAX_ID_SIZE)
        
    
    # Put item in DB
    response = client.put_item(
        Item={
            'ID': {"S":str(id)},
            'LatestGreetingTime': {"S":str(now)},
            'base':{"N": str(event['base'])},
            'exponent':{"N": str(event['exponent'])},
            'result':{"N": str(mathResult)}
            },
        TableName="math"
        )

    # return a properly formatted JSON object
    return {
        'statusCode': 200,
        'body': json.dumps('Your result is ' + str(mathResult)),
        'result': mathResult
    }
```