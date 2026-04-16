with open("client/src/components/Step3Content.jsx", "r") as f:
    text = f.read()

# I will extract everything between `const formContent = (` and `  );` inside `return (` NO wait!
# The form content is inside the `const formContent = (` block until `<div className="sticky bottom-0 ... `
