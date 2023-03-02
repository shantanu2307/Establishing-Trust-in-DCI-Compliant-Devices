import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AddIcon from '@material-ui/icons/Add';
import { useRouter } from 'next/router';

export default function DeviceManufacturerList() {
  const router = useRouter();

  function handleClickToDashboard() {
    router.push('/device_manufacturer/dashboard');
  }

  function handleClickToAddCertificate() {
    router.push('/device_manufacturer/add_certificate');
  }

  return (
    <div>
      <ListItem button onClick={handleClickToDashboard}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button onClick={handleClickToAddCertificate}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Add Certficate" />
      </ListItem>
    </div>
  );
}
