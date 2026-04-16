with open("client/src/components/Step3Content.jsx", "r") as f:
    lines = f.readlines()

def get_lines(start, end):
    return "".join(lines[start-1:end])

uzBasic = get_lines(32, 59)
dateLoc = get_lines(61, 114)
uzMsg   = get_lines(116, 126)
langTog = get_lines(128, 164)
qqBasic = get_lines(166, 202)
ruBasic = get_lines(204, 239)
tempF   = get_lines(241, 269)
extras  = get_lines(271, 352)
uzProg  = get_lines(354, 435)
qqProg  = get_lines(437, 480)
ruProg  = get_lines(482, 528)
gallery = get_lines(530, 577)

# Now, we want to group UZ into one nice glass panel. Wait, they are ALREADY in glass panels. 
# We just need to align them optimally.

# Let's wrap QQ in one panel.
qqBasicInner = "\n".join(qqBasic.split("\n")[2:-3]) + "\n"
qqProgInner = "\n".join(qqProg.split("\n")[2:-2]) + "\n"
qqCombined = f"""      {{/* QQ FIELDS & PROGRAM */}}
      {{data.customFields?.langQq && (
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          🔵 Qaraqalpoq tili
        </h3>
{qqBasicInner}
{qqProgInner}      </div>
      )}}
"""

# Same for RU
ruBasicInner = "\n".join(ruBasic.split("\n")[2:-3]) + "\n"
ruProgInner = "\n".join(ruProg.split("\n")[2:-2]) + "\n"
ruCombined = f"""      {{/* RU FIELDS & PROGRAM */}}
      {{data.customFields?.langRu && (
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          🔴 Русский язык
        </h3>
{ruBasicInner}
{ruProgInner}      </div>
      )}}
"""

# And for UZ, they are natively wrapped in `isUzOn` already!
uzCombined = uzBasic + "\n" + uzMsg + "\n" + uzProg + "\n"

# Desired sequence:
new_middle = (
    langTog + "\n      </div>\n\n" + 
    tempF + "\n" + 
    dateLoc + "\n" + 
    uzCombined + "\n" + 
    qqCombined + "\n" + 
    ruCombined + "\n" + 
    extras + "\n" + 
    gallery + "\n"
)

new_text = "".join(lines[:31]) + new_middle + "".join(lines[578:])

with open("client/src/components/Step3Content.jsx", "w") as f:
    f.write(new_text)

print("SUCCESS")
