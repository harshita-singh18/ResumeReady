document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector('form[action="signup"]');
  const loginForm = document.querySelector('form[action="login"]');

  if(signupForm){
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('exampleInputEmail1').value.trim();
      const password = document.getElementById('exampleInputPassword1').value.trim();
console.log(firstName)
      if(firstName && lastName && email && password){
        // store user data in localStorage
        const user = {firstName, lastName, email, password};
         console.log(JSON.stringify(user))
        localStorage.setItem(email, JSON.stringify(user))
        console.log(JSON.stringify(user))
        // redirect to home page
        window.location.href = 'home.html';
      }
      else{
        alert('Please fill in all fields');
      }
    });
  }

  if(loginForm){
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

    const email = document.getElementById('exampleInputEmail1').value.trim();
    const password = document.getElementById('exampleInputPassword1').value.trim();

    const user = JSON.parse(localStorage.getItem(email));
    console.log(user)
    if(user && user.password === password){
      // redirect to home page
      window.location.href = 'home.html';
    }
    else{
      alert('Invalid email or password')
    }

      
    });
                               
  }
  
});
