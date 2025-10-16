export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Health Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Search through Texas Ambetter health plans to find the coverage that's right for you.
          Compare plans, check eligibility, and get AI-powered insights.
        </p>
      </div>

      <div className="card max-w-2xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Search Plans</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search for health plans..."
              className="input-field flex-1"
            />
            <button className="btn-primary">
              Search
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="input-field">
              <option value="">Select County</option>
              <option value="harris">Harris County</option>
              <option value="dallas">Dallas County</option>
              <option value="travis">Travis County</option>
            </select>
            
            <select className="input-field">
              <option value="">Tobacco Use</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            
            <select className="input-field">
              <option value="">Plan Type</option>
              <option value="epo">EPO</option>
              <option value="hmo">HMO</option>
              <option value="ppo">PPO</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-ambetter-blue mb-2">500+</div>
          <div className="text-gray-600">Health Plans Available</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-ambetter-green mb-2">AI-Powered</div>
          <div className="text-gray-600">Smart Recommendations</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-ambetter-blue mb-2">Real-time</div>
          <div className="text-gray-600">Live Analytics</div>
        </div>
      </div>
    </div>
  )
}
