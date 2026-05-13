with open('src/utils/templateEngine.js', 'r') as f:
    text = f.read()

# Fix double backslash before quotes
text = text.replace("to\\'yiga", "to\\'yiga".replace("\\'", "\\'").replace("\\\\", "\\"))
text = text.replace("so\\'rab", "so\\'rab".replace("\\'", "\\'").replace("\\\\", "\\"))
text = text.replace("ko\\'ring", "ko\\'ring".replace("\\'", "\\'").replace("\\\\", "\\"))
text = text.replace("Tug\\'ilgan", "Tug\\'ilgan".replace("\\'", "\\'").replace("\\\\", "\\"))

with open('src/utils/templateEngine.js', 'w') as f:
    f.write(text)

print("Syntax fixed")
