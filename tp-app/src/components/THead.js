import React from 'react'
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';

const THead = props =>{
    return(
        <TableHead style={{backgroundColor:'rgb(245, 245, 245)'}}>
            <TableRow>
                {props.fields.map((e,index)=>(
                    <TableCell key={index}>
                        <Typography variant='button'>
                            {e}
                        </Typography>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>    
    );    
}



export default THead;
