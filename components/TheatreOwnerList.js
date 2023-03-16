import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AddIcon from '@material-ui/icons/Add';
import { useRouter } from 'next/router';

export default function TheatreOwnerList() {
    const router = useRouter();

    function handleClickToDashboard() {
        router.push('/theatre_owner/dashboard');
    }

    function handleClickToGenerateKDM() {
        router.push('/theatre_owner/generate_kdm');
    }

    return (
        <div>
            <ListItem button onClick={handleClickToDashboard}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleClickToGenerateKDM}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Generate KDM" />
            </ListItem>
        </div>
    );
}
