import './App.css';

import LineChart from './charts/LineChart';

function App() {
  return (
    <div className='App'>
      <h2> React & D3 Chart Examples </h2>
      <div className='row'>
        <LineChart width={400} height={300} />
      </div>
    </div>
  );
}

export default App;
