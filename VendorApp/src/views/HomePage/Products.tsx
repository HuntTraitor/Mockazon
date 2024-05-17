// import {
//   Typography,
//   Box,
//   Paper,
//   TableContainer,
//   Table,
//   TableBody,
//   TableRow,
//   TableCell,
//   // Button,
//   TableHead,
// } from '@mui/material';
// // import EditIcon from '@mui/icons-material/Edit';
// import React from 'react';

// interface Product {
//   id: string;
//   data: {
//     name: string;
//     price: number;
//   };
// }

// const fetchProducts = (setProducts: (products: Product[]) => void) => {
//   const query = {
//     query: `query product {product (vendor_id: "78b9467a-8029-4c1f-afd9-ea56932c3f45") {id, data {name, price}}}`,
//   };
//   fetch(`${basePath}/api/graphql`, {
//     method: 'POST',
//     body: JSON.stringify(query),
//     headers: {
//       // Need authorization header
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(res => {
//       return res.json();
//     })
//     .then(json => {
//       if (json.errors) {
//         setProducts([]);
//       } else {
//         setProducts(json.data.product);
//       }
//     })
//     .catch(e => {
//       console.log(e.error);
//       alert(e.toString());
//     });
// };

// const Products = () => {
//   const [products, setProducts] = React.useState<Product[]>([]);
//   React.useEffect(() => {
//     fetchProducts(setProducts);
//   }, []);

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', padding: '3'}}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Products
//       </Typography>
//       <Paper
//         sx={{
//           border: '1px solid rgba(0, 0, 0, 0.12)',
//           borderRadius: '4px',
//           elevation: 0,
//           height: '100vh',
//         }}
//       >
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Price</TableCell>
//                 {/* <TableCell>Action</TableCell> */}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {products.map(product => (
//                 <TableRow key={product.id}>
//                   <TableCell>{product.data.name}</TableCell>
//                   <TableCell>{product.data.price}</TableCell>
//                   {/* <TableCell>
//                     <Button
//                       style={{ borderColor: 'grey', color: 'grey' }}
//                       variant="outlined"
//                       startIcon={<EditIcon />}
//                     >
//                       Edit
//                     </Button>
//                   </TableCell>
//                   <TableCell>
//                     <Button variant="outlined" color="error">
//                       Delete
//                     </Button>
//                   </TableCell> */}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// };

// export default Products;
