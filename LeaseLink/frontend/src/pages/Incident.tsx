import React, { useState } from 'react';
import { Typography, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Incident {
    id: string;
    title: string;
    openDate: Date;
    closeDate?: Date | null;
    // Add other properties as per your incident schema
}

const Incident = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    if (!auth) {
        return <Typography>Loading...</Typography>;
    }

    // Sort incidents so that open incidents come first, then closed incidents
    const sortedIncidents = auth?.user?.incidents.slice().sort((a: Incident, b: Incident) => {
        if (!a.closeDate && b.closeDate) return -1; // a is open, b is closed (a comes first)
        if (a.closeDate && !b.closeDate) return 1; // a is closed, b is open (b comes first)
        return 0; // both are open or both are closed (no change in order)
    });

    const handleIncidentClick = (incident: Incident) => {
        if (selectedIncident && selectedIncident.id === incident.id) {
            // If the clicked incident is already selected, deselect it
            setSelectedIncident(null);
        } else {
            // Otherwise, select the clicked incident
            setSelectedIncident(incident);
        }
    };

    const handleChatClick = (incidentId: string) => {
        navigate(`/chat/${incidentId}`);
    };

    const handleDeleteIncident = (incidentId: string) => {
        // Implement delete incident functionality here
        console.log(`Deleting incident with ID: ${incidentId}`);
    };

    const handleCreateNewIncident = () => {
        // Implement create new incident functionality here
        console.log("Creating new incident...");
    };

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 4, height: 'calc(100vh - 64px)' }}>
            {/* Left side with scrollable incident list */}
            <Box sx={{ overflowY: 'auto', maxHeight: '100%', paddingRight: 2, pl: 2 }}>
                <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: '#05101c', paddingBottom: 2 }}>
                    <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>My Incidents</Typography>
                    <Button
                        onClick={handleCreateNewIncident}
                        variant="contained"
                        sx={{ width: '100%', bgcolor: '#00bcd4', color: 'white', '&:hover': { bgcolor: '#0097a7' } }}
                    >
                        Create New Incident
                    </Button>
                </Box>
                <List>
                    {sortedIncidents?.map((incident: Incident) => (
                        <ListItem
                            key={incident.id}
                            button
                            selected={selectedIncident === incident}
                            onClick={() => handleIncidentClick(incident)}
                        >
                            <ListItemText
                                primary={incident.title}
                                secondary={incident.closeDate ? 'Closed' : 'Open'}
                                primaryTypographyProps={{ sx: { fontFamily: 'work sans' } }}
                                secondaryTypographyProps={{ sx: { fontFamily: 'work sans', color: incident.closeDate ? 'red' : 'green' } }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Right side panel with incident details */}
            <Box sx={{ p: 2, borderLeft: '1px solid #ccc', display: 'flex', flexDirection: 'column'}}>
                {selectedIncident ? 
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {selectedIncident.title}
                </Typography> : 
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                    <Typography variant="h4" sx={{ textAlign: 'center', display: 'block', marginBottom: 1, color: "#ffffff48" }}>
                        Select an Incident
                    </Typography>
                    <Typography variant="h6" sx={{ textAlign: 'center', display: 'block', color: "#ffffff48" }}>
                    or <a
                        onClick={handleCreateNewIncident}
                        style={{
                            color: '#00bcd4', // Light blue color
                            textDecoration: 'underline', // Underline text
                            cursor: 'pointer', // Change cursor to pointer on hover
                            marginLeft: "5px",
        }
                            
                        }
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'none'} // Remove underline on hover
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'underline'} // Add underline when not hovered
                    >
                        Create One
                    </a>
                    </Typography>
                </div>
            
}
                {selectedIncident && (
                    <div>
                        <Typography variant="body1" sx={{ mb: 1 }}>Incident ID: {selectedIncident.id}</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>Open Date: {new Date(selectedIncident.openDate).toLocaleString()}</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Close Date: {selectedIncident.closeDate ? new Date(selectedIncident.closeDate).toLocaleString() : ''}
                        </Typography>


                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => handleChatClick(selectedIncident.id)}
                            >
                                Go to Chat
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => handleDeleteIncident(selectedIncident.id)}
                                sx={{ bgcolor: '#f44336', color: 'white', ml: 2, mr: 4 }} // Adjusted mr value
                            >
                                Delete Incident
                            </Button>
                        </Box>

                    </div>
                )}
            </Box>
        </Box>
    );
};

export default Incident;
