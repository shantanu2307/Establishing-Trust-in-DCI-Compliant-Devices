import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@material-ui/core';
import instance from '../axios.config';
import { useSWRConfig } from 'swr';

export default function InteractiveList({ page, dkdms }) {
  const { mutate } = useSWRConfig();
  const index = page * 10 - 10;
  async function handleDelete(dkdm) {
    try {
      await instance.post('/distribution_house/delete_dkdm', {
        movie_name: dkdm,
      });
      mutate(
        '/distribution_house/get_dkdm',
        { dkdms: dkdms.filter((item) => item !== dkdm) },
        false
      );
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <Box container spacing={2}>
        <Grid item xs={12} md={6}>
          <List>
            {index >= 0 &&
              dkdms.slice(index, index + 10).map((dkdm) => {
                return (
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(dkdm);
                          }}
                        />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <Typography>{dkdm}</Typography>
                  </ListItem>
                );
              })}
          </List>
        </Grid>
      </Box>
    </Box>
  );
}
