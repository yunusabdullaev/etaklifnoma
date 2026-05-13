with open("src/utils/templateEngine.js", "r") as f:
    text = f.read()

# Add to uz
text = text.replace(
    'bdProgramTitle: "Bayram dasturi",',
    'bdProgramTitle: "Bayram dasturi",\n        bdAge: "yosh",\n        gradYear: "bitiruvchilar",\n        jubYears: "yillik",'
)

# Add to qq
text = text.replace(
    'bdProgramTitle: \'Bayram baǵdarlanması\',',
    'bdProgramTitle: \'Bayram baǵdarlanması\',\n        bdAge: "jas",\n        gradYear: "pitiriwshiler",\n        jubYears: "jıllıq",'
)

# Add to ru
text = text.replace(
    'bdProgramTitle: \'Программа праздника\',',
    'bdProgramTitle: \'Программа праздника\',\n        bdAge: "лет",\n        gradYear: "выпускники",\n        jubYears: "лет",'
)

with open("src/utils/templateEngine.js", "w") as f:
    f.write(text)

print("Small translation words added successfully!")
