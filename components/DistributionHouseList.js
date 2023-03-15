import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AddIcon from '@material-ui/icons/Add';
import { useRouter } from 'next/router';

export default function DistributionHouseList() {
    const router = useRouter();

    function handleClickToDashboard() {
        router.push('/distribution_house/dashboard');
    }

    function handleClickToAddDKDM() {
        router.push('/distribution_house/add_dkdm');
    }

    return (
        <div>
            <ListItem button onClick={handleClickToDashboard}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleClickToAddDKDM}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Add DKDM" />
            </ListItem>
        </div>
    );
}
