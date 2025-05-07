import React from 'react';

const Home = () => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f8ff',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        textAlign: 'center',
        padding: '2rem 1rem', // espaço mais generoso nas laterais
        boxSizing: 'border-box',
    };

    const titleStyle = {
        fontSize: 'clamp(2rem, 10vw, 5.5rem)',
        marginBottom: '1rem',
        color: '#0078d7',
    };

    const paragraphStyle = {
        fontSize: 'clamp(1rem, 5vw, 2.2rem)',
        maxWidth: '800px',
        lineHeight: '1.6',
        margin: '0 auto',
    };

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Bem-vindo à Página Inicial</h1>
            <p style={paragraphStyle}>
                Esta é a sua nova página inicial estilizada. Explore as funcionalidades do sistema e aproveite a experiência!
            </p>
        </div>
    );
};

export default Home;
