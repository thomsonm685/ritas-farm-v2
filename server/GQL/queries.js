import { Shopify } from "@shopify/shopify-api";

export const checkSubscription = async ({ shop, accessToken }) => {
  console.log("in checkSubscription gql");

  try {
    const client = new Shopify.Clients.Graphql(shop, accessToken);
    const subscription = await client.query({
      data: {
        query: `    
              query {
                currentAppInstallation {
                  allSubscriptions(first:100, reverse:true) {
                    edges {
                      node {
                        createdAt
                        id
                        name
                        status
                        test
                      }
                    }
                  }
                }
              }
              `,
      },
    });

    let subscribed =
      subscription.body.data.currentAppInstallation.allSubscriptions.edges.filter(
        (sub) => {
          if (sub.node.status === "ACTIVE") return sub;
        }
      )[0]
        ? true
        : null;
    console.log("is subscribed furthuer:", subscribed);
    // if(subscription.body.data.currentAppInstallation.allSubscriptions.edges[0].node.status==="ACTIVE") {
    //     return subscription.body.data.currentAppInstallation.allSubscriptions
    //     .edges[0].node.name;
    // }
    // else return null;
    return subscribed;
  } catch (err) {
    console.log("ERROR:", err);
    return null;
  }
};

export const checkOneTime = async ({ shop, accessToken, id }) => {
  console.log("in checkOneTime gql");

  try {
    const client = new Shopify.Clients.Graphql(shop, accessToken);
    const oneTime = await client.query({
      data: {
        query: `    
                query {
                    node(id: "gid://shopify/AppPurchaseOneTime/${id}"){
                      ... on AppPurchaseOneTime {
                        price {
                          amount
                          currencyCode
                        }
                        createdAt
                        id
                        name
                        status
                        test
                      }
                    }
                  }
                `,
      },
    });

    console.log("is purchased:", oneTime.body);
    console.log("is purchased furthuer:", oneTime.body.data.node.status);

    return oneTime.body.data.node.status;
  } catch (err) {
    return null;
  }
};
