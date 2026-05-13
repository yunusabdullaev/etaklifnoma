import re

with open('src/utils/templateContent.js', 'r') as f:
    text = f.read()

# 1. Birthday Template
text = text.replace('<p class="hero-label">{{eventTypeLabel|Tug\'ilgan kun}}</p>', '<p class="hero-label" data-i18n="bdEventLabel">{{eventTypeLabel|Tug\'ilgan kun}}</p>')
text = text.replace('<span class="bd-age-text">yosh</span>', '<span class="bd-age-text" data-i18n="bdAge">yosh</span>')
text = text.replace('<div class="ic-title">Sana</div>', '<div class="ic-title" data-i18n="dateLabel">Sana</div>')
text = text.replace('<div class="ic-title">Vaqt</div>', '<div class="ic-title" data-i18n="timeLabel">Vaqt</div>')
text = text.replace('<div class="ic-title">Manzil</div>', '<div class="ic-title" data-i18n="venueLabel">Manzil</div>')
text = text.replace('<a href="{{locationUrl}}" target="_blank" rel="noopener" class="map-nav-btn">Xaritada ko\'rish</a>', '<a href="{{locationUrl}}" target="_blank" rel="noopener" class="map-nav-btn" data-i18n="viewMap">Xaritada ko\'rish</a>')

# 2. Graduation Template
text = text.replace('<p class="hero-label">{{eventTypeLabel|Bitiruv kechasi}}</p>', '<p class="hero-label" data-i18n="gradEventLabel">{{eventTypeLabel|Bitiruv kechasi}}</p>')
text = text.replace('<span class="grad-year-text">bitiruvchilar</span>', '<span class="grad-year-text" data-i18n="gradYear">bitiruvchilar</span>')

# 3. Jubilee Template
text = text.replace('<p class="hero-label">{{eventTypeLabel|Yubiley}}</p>', '<p class="hero-label" data-i18n="jubEventLabel">{{eventTypeLabel|Yubiley}}</p>')
text = text.replace('<span class="jub-years-text">yillik</span>', '<span class="jub-years-text" data-i18n="jubYears">yillik</span>')

with open('src/utils/templateContent.js', 'w') as f:
    f.write(text)

print("SUCCESS: Injected data-i18n into HTML templates!")
