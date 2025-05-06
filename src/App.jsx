import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/pages/home';
import Page404 from './components/pages/page404';
import Tracking from './components/pages/Tracking';
import './App.css';

function App() {
  console.log(`
                GET OUT OF THE CONSOLE!
     .@@@@@@@(
    @@       .@%
   ,@  (@&@,   @%
    @@ @@  @@. ,@
     (@@&    .@@@@.
       @@.        @&
        ,@@@      ,@
       @@@@@@%    @@                       ,&@@@@@@@@@@@@@@@@@/
       .@@@@@& %@@&                  @@@@@@@@                (@@@@@@
       @@(                      %@@@@%                             @@@@
      @@@                    @@@@/      @@                     &@@    @@@
      @@*                  @@@/                                        @@@
      @@.                @@@                                          &@@@
      @@(              @@@.                      ,(#@@@@@@@@@@@@@@@@@@@.
      @@@             @@@         %@@@@@@@@@@@@@@@@&#/,.          @@*
      .@@.           @@@                                          @@&
       @@@          @@@                                           @@@
        @@@        @@@                                            @@@
         @@#      (@@                                             %@@
         .@@&     @@#                                             /@@@@@
           @@@   @@@                                              .@@  @@@@
            /@@@@@@(@@                                             @@     @@@
                @@@@#,                                             @@      @@@
               .@@.                                                @@.    @@@
               @@@                                                 @@.  @@@/
               @@*                                                 @@.@@@*
              @@@                                                  @@@@@
              @@&                                                  @@@@@@.
             *@@                                                   @@@@@
             @@@                                                  .@@
             @@%                                                  ,@@
            ,@@                                                   *@@
            @@@                                                   /@@
            @@@                                                   #@@
            @@%                                                   %@@

  `);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='*' element={<Navigate to='/404' replace />} />
      <Route path='/404' element={<Page404 />} />
      <Route path='/tracking' element={<Tracking />} />
    </Routes>
  );
}

export default App;
