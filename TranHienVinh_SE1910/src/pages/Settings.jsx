import React from 'react';
import { Card } from 'react-bootstrap';

const Settings = () => {
  return (
    <div>
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-4">Settings</h4>
          <p className="text-muted">Configuration and preferences will go here.</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
