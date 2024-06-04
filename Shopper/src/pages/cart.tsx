import { useTheme, useMediaQuery } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
const { basePath } = getConfig().publicRuntimeConfig;
import { ReactElement } from 'react';
import Layout from '@/components/Layout';
import { Product, ProductFromFetch } from '../../types';
import { enqueueSnackbar } from 'notistack';
import DesktopCart from '@/views/cart/DesktopCart';
import MobileCart from '@/views/cart/MobileCart';

const namespaces = [
  'products',
  'topHeader',
  'common',
  'signInDropdown',
  'accountDrawer',
  'cart',
  'viewProduct',
];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
      locale: context.locale ?? 'en',
    },
  };
};

const Cart = ({ locale }: { locale: string }) => {
  const [products, setProducts] = useState([] as Product[]);
  const { t } = useTranslation(['products', 'cart']);
  const [subtotal, setSubtotal] = useState(0.0);
  const { user, accessToken } = useContext(LoggedInContext);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // https://chat.openai.com/share/66cd884d-cc95-4e82-8b4f-a4d035f844af
  // https://chat.openai.com/share/86f158f1-110e-4905-ac4a-85ae8282f2c2
  // https://chatgpt.com/share/872a5a3a-b9fa-4b65-aff1-7267086d14ce
  // https://chatgpt.com/share/018e08ea-be97-49b5-a207-a8ade89baf92
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.accessToken) {
      // FIXME: This needs to be handled globally, think back on the Authenticated Routes example
      window.location.href = '/login';
      return;
    }
    // user access token present but accessToken hasn't been loaded yet
    if (!accessToken) {
      return;
    }
    const query = {
      query: `query GetShoppingCart {
    getShoppingCart {
      id
      product_id
      shopper_id
      data {
        quantity
      }
    }
  }`,
    };
    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(query),
    })
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(shoppingCartProducts => {
        if (
          shoppingCartProducts.errors &&
          shoppingCartProducts.errors.length > 0
        ) {
          enqueueSnackbar(t('cart:errorFetchingProducts'), {
            variant: 'error',
            persist: false,
            autoHideDuration: 3000,
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
          });
          return;
        }
        const fetchPromises = shoppingCartProducts.data.getShoppingCart.map(
          async (product: ProductFromFetch) => {
            const query = {
              query: `query GetProduct {
              getProduct(productId: "${product.product_id}") {
                id
                vendor_id
                data {
                  brand
                  name
                  rating
                  price
                  deliveryDate
                  image
                }
              }
            }`,
            };
            try {
              const response = await fetch(`${basePath}/api/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query),
              });
              if (!response.ok) {
                throw response;
              }
              const productData = await response.json();
              return {
                ...productData,
                quantity: product.data.quantity,
              };
            } catch (err) {
              enqueueSnackbar(t('cart:errorFetchingProducts'), {
                variant: 'error',
                persist: false,
                autoHideDuration: 3000,
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
              });
            }
          }
        );
        Promise.all(fetchPromises)
          .then(productsWithContent => {
            setProducts(productsWithContent);
            const subtotal: number = productsWithContent.reduce(
              (accumulator: number, currentValue: Product) => {
                return (
                  accumulator +
                  (currentValue.data.getProduct.data.price as number) *
                    parseInt(currentValue.quantity)
                );
              },
              0
            );
            setSubtotal(Math.round(subtotal * 100) / 100);
          })
          .catch(() => {
            enqueueSnackbar(t('cart:errorFetchingProducts'), {
              variant: 'error',
              persist: false,
              autoHideDuration: 3000,
              anchorOrigin: { horizontal: 'center', vertical: 'top' },
            });
          });
      })
      .catch(() => {
        enqueueSnackbar(t('cart:errorFetchingProducts'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      });
  }, [router, user, accessToken, t]);

  const handleRemove = (productId: string) => {
    const query = {
      query: `mutation RemoveFromShoppingCart {
      removeFromShoppingCart(productId: "${productId}") {
        product_id
        shopper_id
      }
    }`,
    };
    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(query),
    })
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(removedProduct => {
        if (removedProduct.errors && removedProduct.errors.length > 0) {
          enqueueSnackbar(t('cart:errorRemovingProduct'), {
            variant: 'error',
            persist: false,
            autoHideDuration: 3000,
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
          });
          return;
        }
        const listsOfProductsToKeep = products.filter(
          product => product.data.getProduct.id !== productId
        );
        setProducts(listsOfProductsToKeep);

        // Check if the products array is empty after removing the item
        if (listsOfProductsToKeep.length === 0) {
          // If empty, set the subtotal to 0
          setSubtotal(0);
        } else {
          // Otherwise, recalculate the subtotal
          const subtotal: number = listsOfProductsToKeep.reduce(
            (accumulator: number, currentValue: Product) => {
              return (
                accumulator +
                (currentValue.data.getProduct.data.price as number)
              );
            },
            0
          );
          setSubtotal(subtotal);
        }
      })
      .catch(() => {
        enqueueSnackbar(t('cart:errorRemovingProduct'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      });
  };

  const calculateSubtotal = (updatedProducts: Product[]) => {
    const newSubtotal: number = updatedProducts.reduce(
      (accumulator: number, currentValue: Product) => {
        return (
          accumulator +
          (currentValue.data.getProduct.data.price as number) *
            parseInt(currentValue.quantity)
        );
      },
      0
    );
    setSubtotal(Math.round(newSubtotal * 100) / 100);
  };

  const handleQuantityChange = (productId: string, quantity: string) => {
    const query = {
      query: `mutation UpdateCart {
        updateShoppingCart(
          productId: "${productId}"
          quantity: "${quantity}"
        ) {
          id
          product_id
          shopper_id
          data {
            quantity
          }
        }
      }`,
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(query),
    })
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(updatedCart => {
        if (updatedCart.errors && updatedCart.errors.length > 0) {
          //console.error(updatedCart.errors[0].message);
          enqueueSnackbar(t('cart:errorUpdatingQuantity'), {
            variant: 'error',
            persist: false,
            autoHideDuration: 3000,
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
          });
          return;
        }
        // Update the local state with the updated quantity
        const updatedProducts = products.map(product => {
          if (product.data.getProduct.id === productId) {
            return {
              ...product,
              quantity: quantity,
            };
          }
          return product;
        });
        setProducts(updatedProducts);
        calculateSubtotal(updatedProducts);
      })
      .catch(() => {
        //console.error('Error updating quantity:', err);
        enqueueSnackbar(t('cart:errorUpdatingQuantity'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      });
  };

  // Desktop Cart
  return isMobile ? (
    <MobileCart
      products={products}
      subtotal={subtotal}
      user={user}
      locale={locale}
      handleRemove={handleRemove}
      handleQuantityChange={handleQuantityChange}
    />
  ) : (
    <DesktopCart
      products={products}
      subtotal={subtotal}
      user={user}
      locale={locale}
      handleRemove={handleRemove}
      handleQuantityChange={handleQuantityChange}
    />
  );
};

Cart.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Cart;
