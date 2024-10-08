import './App.css';

import LineChart from './charts/LineChart';
import TimeSeries from './charts/TimeSeries';

function App() {
  return (
    <div className='App'>
      <h2> React & D3 Chart Examples </h2>
      <div className='row'>
        <LineChart width={400} height={300} />
        <TimeSeries width={400} height={300} />
      </div>
    </div>
  );
}

export default App;
