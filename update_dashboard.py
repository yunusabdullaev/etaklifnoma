import re

with open('client/src/components/Dashboard.jsx', 'r') as f:
    text = f.read()

# Update signature
search1 = """export default function Dashboard({ token, onCreateNew }) {"""
replace1 = """export default function Dashboard({ token, onCreateNew, onContinueDraft }) {"""
text = text.replace(search1, replace1)

# Update state
search2 = """  const [duplicating, setDuplicating] = useState(null); // slug being duplicated"""
replace2 = """  const [duplicating, setDuplicating] = useState(null); // slug being duplicated
  const [hasDraft, setHasDraft] = useState(false);"""
text = text.replace(search2, replace2)

# Update useEffect
search3 = """  useEffect(() => { fetchInvitations(); }, []);"""
replace3 = """  useEffect(() => { 
    try {
      const draft = localStorage.getItem('etaklifnoma_wizard_draft');
      if (draft && JSON.parse(draft).step) setHasDraft(true);
    } catch(e){}
    fetchInvitations(); 
  }, []);"""
text = text.replace(search3, replace3)

# Update top button
search4 = """        <button onClick={handleCreateNew} className="btn-primary flex items-center gap-2 px-5 py-2.5">
          <Plus size={16} /> {t('dashboard.newBtn')}
        </button>
      </div>"""
replace4 = """        <div className="flex gap-3">
          {hasDraft && (
            <button onClick={onContinueDraft} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all text-accent-400 bg-accent-500/10 border border-accent-500/20 hover:bg-accent-500/20 shadow-sm shadow-accent-500/10">
              <Pencil size={16} /> Davom etish
            </button>
          )}
          <button onClick={handleCreateNew} className="btn-primary flex items-center gap-2 px-5 py-2.5">
            <Plus size={16} /> {t('dashboard.newBtn')}
          </button>
        </div>
      </div>"""
text = text.replace(search4, replace4)

# Update body empty button
search5 = """          <button onClick={handleCreateNew} className="btn-primary inline-flex items-center gap-2 px-6 py-3">
            <Plus size={18} /> {t('dashboard.createBtn')}
          </button>
        </motion.div>"""
replace5 = """          <div className="flex justify-center gap-3">
            {hasDraft && (
              <button onClick={onContinueDraft} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-accent-400 bg-accent-500/10 border border-accent-500/20 hover:bg-accent-500/20">
                <Pencil size={18} /> Davom etish
              </button>
            )}
            <button onClick={handleCreateNew} className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <Plus size={18} /> {t('dashboard.createBtn')}
            </button>
          </div>
        </motion.div>"""
text = text.replace(search5, replace5)

with open('client/src/components/Dashboard.jsx', 'w') as f:
    f.write(text)

print("SUCCESS: Dashboard updated.")
