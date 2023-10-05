import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout/MainLayout';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

// import routes
import Home from './components/pages/Home/HomePage';
import NotFound from './components/pages/NotFound/NotFoundPage';

import SignUp from './components/pages/SignUp/SignUp';
import SignIn from './components/pages/SignIn/SignIn';
import SignOut from './components/pages/SignOut/SignOut';

import Ad from './components/pages/Ad/Ad';
import AdAdd from './components/pages/AdAdd/AdAdd';
import AdEdit from './components/pages/AdEdit/AdEdit';
import AdDelete from './components/pages/AdDelete/AdDelete';

import Search from './components/pages/Search/Search';

import { API_URL } from './config';
import { logIn } from './redux/usersRedux';
import { useSelector } from 'react-redux';
import { useState } from 'react';

import { fetchAds } from './redux/adsRedux';

const App = () => {
  // const user = useSelector((state) => state.user);
  // console.log(user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);

  useEffect(() => {
    // Try to load user data from local storage
    const userData = localStorage.getItem('user');
    console.log(userData);
    if (userData) {
      const userObj = JSON.parse(userData);
      dispatch(logIn(userObj));
    } else {
      // If not found in local storage, fetch from the server
      fetch(`${API_URL}auth/user`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          if (response) {
            dispatch(logIn(response));
            // Save the fetched user data in local storage
            localStorage.setItem('user', JSON.stringify(response));
          }
        })
        .catch((error) => {
          console.error('Błąd podczas pobierania danych użytkownika:', error);
        });
    }
  }, [dispatch]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/ad/:id" element={<Ad />} />
        <Route path="/ad/add" element={<AdAdd />} />
        <Route path="/ad/edit/:id" element={<AdEdit />} />
        <Route path="/ad/delete/:id" element={<AdDelete />} />

        <Route path="/search/:searchPhrase" element={<Search />} />

        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-out" element={<SignOut />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
