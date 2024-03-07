import React from "react";
import { useQuery} from "react-query";
function DisplayProduct() {
    const { data :any , isSuccess} = useQuery({
        queryKey: ["productList"],
        queryFn: () => {
            fetch('https://fakestoreapi.com/products')
                .then(res => res.json())
                .then(json => json)
        }
    });


    return (
        <div>
          <h4>DisplayProductList</h4>
          <div>
            {/* {isSuccess? (
              data.map((product, key) => {
                return (
                  <div key={key}>
                    {product}
                  </div>
                );
              })
            ) : (
              <div></div>
            )} */}
          </div>
        </div>
      );
    }
    
export default DisplayProduct;