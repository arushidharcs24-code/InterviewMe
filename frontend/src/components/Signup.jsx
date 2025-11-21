import React, { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    alert("Account created! (demo)");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Your Account</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button}>Sign Up</button>
          <p style={{ marginTop: "15px", fontSize: "14px" }}>
  Already have an account?
  <a href="/login" style={{ color: "#667eea", fontWeight: "bold", marginLeft: "5px" }}>
    Sign In
  </a>
</p>

        </form>
      </div>
    </div>
  );
}

const styles = {
 container: {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
},

  card: {
  width: "350px",
  padding: "30px",
  background: "white",
  borderRadius: "15px",
  boxShadow: "0px 0px 20px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",   
  justifyContent: "center", 
},

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#667eea",
    fontSize: "24px",
    fontWeight: "bold",
  },

  input: {
  width: "280px",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
},


button: {
  width: "280px",
  padding: "12px",
  background: "#667eea",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  display: "block",
  marginTop: "5px",
  marginLeft: "auto",
  marginRight: "auto",
},


};

export default Signup;
