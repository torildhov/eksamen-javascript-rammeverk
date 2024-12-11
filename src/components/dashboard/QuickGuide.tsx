export function QuickGuide() {
    return (
      <div className="mt-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Guide</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 p-4 rounded-xl">
            <div className="text-indigo-200 text-xl mb-2">Getting Started</div>
            <div className="space-y-2">
              <p className="text-white">1. Create your CV using our professional template</p>
              <p className="text-white">2. Add your skills, education, experience and references</p>
              <p className="text-white">3. Export as PDF and share with employers</p>
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl">
            <div className="text-indigo-200 text-xl mb-2">Pro Tips</div>
            <div className="space-y-2">
              <p className="text-white">💡 Keep your CV updated with latest achievements</p>
              <p className="text-white">💡 Use action verbs to describe your experience</p>
              <p className="text-white">💡 Highlight key skills relevant to your field</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  