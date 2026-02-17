import React from "react";

const Footer = () => {
    return (
        <footer className="bg-light text-dark py-3 mt-auto">
            <div className="container-fluid">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small">

                    <p className="mb-1 mb-md-0">
                        © 2026 <strong className="text-info">E-Dashboard</strong>. All rights reserved.
                    </p>

                    <p className="mb-0 text-secondary">
                        Designed & Developed by <strong>Tejas Waghmode</strong>
                    </p>

                </div>
            </div>
        </footer>

    );
}

export default Footer;