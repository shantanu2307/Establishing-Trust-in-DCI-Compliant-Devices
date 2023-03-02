import { Grid, Paper } from '@material-ui/core'
import styles from '../styles/cardlist.module.css'
import React from 'react'
import Card from './Card'

export default function CardList({ certificates }) {
    return (
        <>
            <Grid container spacing={3} className={styles.grid}>
                {certificates.map((certificate, index) => (
                    <Grid item key={index}>
                        <Paper className={styles.paper}>
                            <Card
                                heading={"Certificate " + (index + 1)}
                                hash={certificate.hashed_key}
                                created_by={certificate.created_by}
                                created_at={certificate.created}
                                updated_at={certificate.updated}
                            />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}
