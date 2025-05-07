import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/pages/home';
import Page404 from './components/pages/page404';
import PersonalKitForm from './components/pages/personalkit';
import './App.css';

import { ApiProvider } from './context/ApiContext';

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
    <ApiProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/kit' element={<PersonalKitForm />} />
        <Route path='*' element={<Navigate to='/404' replace />} />
        <Route path='/404' element={<Page404 />} />
      </Routes>
    </ApiProvider>
  );
}

export default App;
