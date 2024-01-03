import boto3
from botocore.exceptions import ClientError

# Replace sender@example.com with your "From" address.
# This address must be verified with Amazon SES.
SENDER = "official@ingroup.chat"

# Replace recipient@example.com with a "To" address. If your account 
# is still in the sandbox, this address must be verified.
# RECIPIENT = "nicolas.kong@ingroup.chat"
RECIPIENT = "faria.chen@ingroup.chat"

# Specify a configuration set. If you do not want to use a configuration
# set, comment the following variable, and the 
# ConfigurationSetName=CONFIGURATION_SET argument below.
CONFIGURATION_SET = "ConfigSet"

# If necessary, replace us-west-2 with the AWS Region you're using for Amazon SES.
AWS_REGION = "us-west-1"

# The subject line for the email.
SUBJECT = "Amazon SES Test (SDK for Python)"

# The email body for recipients with non-HTML email clients.
BODY_TEXT = ("Amazon SES Test (Python)\r\n"
             "This email was sent with Amazon SES using the "
             "AWS SDK for Python (Boto)."
            )
            
# The HTML body of the email.
BODY_HTML = """<html>
<head></head>
<body>
  <h1>Amazon SES Test (SDK for Python)</h1>
  <p>This email was sent with
    <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
    <a href='https://aws.amazon.com/sdk-for-python/'>
      AWS SDK for Python (Boto) {{name}}</a>.</p>
</body>
</html>
            """            

# The character encoding for the email.
CHARSET = "UTF-8"

# Create a new SES resource and specify a region.
client = boto3.client('ses',region_name=AWS_REGION)

# Try to send the email.
try:
    content = open('emailt/official.html').read()
    response = client.create_template(
        Template={
            'TemplateName': 'welcome',
            'SubjectPart': 'Subscription Successful!',
            'TextPart': 'Subscription Successful!',
            'HtmlPart': content
        }
    )
    print(response)

    # content = open('emailt/verify.html').read()
    # response = client.create_template(
    #     Template={
    #         'TemplateName': 'verify',
    #         'SubjectPart': 'Verify Email Address',
    #         'TextPart': 'Verify Email Address',
    #         'HtmlPart': content
    #     }
    # )
    # # print(response)

    # content = open('emailt/trade-template.html').read()
    # response = client.create_template(
    #     Template={
    #         'TemplateName': 'open-position',
    #         'SubjectPart': 'Open Position',
    #         'TextPart': 'Open Position',
    #         'HtmlPart': content
    #     }
    # )
    # # print(response)

    # content = open('emailt/trade-template.html').read()
    # response = client.create_template(
    #     Template={
    #         'TemplateName': 'close-position',
    #         'SubjectPart': 'Close Position',
    #         'TextPart': 'Close Position',
    #         'HtmlPart': content
    #     }
    # )
    # # print(response)

    # content = open('emailt/trade-template.html').read()
    # response = client.create_template(
    #     Template={
    #         'TemplateName': 'liqui',
    #         'SubjectPart': 'Liquidation',
    #         'TextPart': 'Liquidation',
    #         'HtmlPart': content
    #     }
    # )
    # # print(response)

    # content = open('emailt/trade-template.html').read()
    # response = client.create_template(
    #     Template={
    #         'TemplateName': 'liqui-warning',
    #         'SubjectPart': 'Liquidation Warning',
    #         'TextPart': 'Liquidation Warning',
    #         'HtmlPart': content
    #     }
    # )
    # print(response)

    # response = client.send_templated_email(
    #     Source=SENDER,
    #     Destination={
    #         'ToAddresses': [
    #             RECIPIENT,
    #             # 'qinghua.yang@ingroup.chat',
    #             # 'nicolas.kong@ingroup.chat'
    #         ]
    #     },
    #     Template='welcome',
    #     TemplateData='{"official_url": "https://main.d6j42zwh06pm8.amplifyapp.com/", "app_url": "https://main.d7u2msnczqldy.amplifyapp.com/"}'
    # )

    # response = client.send_templated_email(
    #     Source=SENDER,
    #     Destination={
    #         'ToAddresses': [
    #             RECIPIENT,
    #             # 'qinghua.yang@ingroup.chat',
    #             # 'nicolas.kong@ingroup.chat'
    #         ]
    #     },
    #     Template='verify',
    #     TemplateData='{"official_url": "https://main.d6j42zwh06pm8.amplifyapp.com/", "app_url": "https://main.d7u2msnczqldy.amplifyapp.com/"}'
    # )
    # response = client.send_templated_email(
    #     Source=SENDER,
    #     Destination={
    #         'ToAddresses': [
    #             RECIPIENT,
    #             # 'qinghua.yang@ingroup.chat',
    #             # 'nicolas.kong@ingroup.chat'
    #         ]
    #     },
    #     Template='liqui',
    #     TemplateData='{"official_url": "https://main.d6j42zwh06pm8.amplifyapp.com/", "title": "title", "content": "content"}'
    # )
    # print(response)

    templates = client.list_templates()
    for template in templates['TemplatesMetadata']:
        name = template['Name']
        print(name)
        # client.delete_template(TemplateName='welcome')
    
# Display an error if something goes wrong.	
except ClientError as e:
    print(e.response['Error']['Message'])
else:
    print("Email sent! Message ID:"),
    # print(response['MessageId'])
