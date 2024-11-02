**The problem BlinkifySell solves**
---
One of the biggest problems in crypto/web3 is onboarding web2 users to web3. Solana blinks were introduced this year to reduce this gap and blinks are gaining traction gradually. One of the main breakthroughs during the beginning of web2 was online shopping. My project aims to do the same with web3. Merchant can add their wallet and product details on the BlinkifySell App and the app automatically generates a blink for that product which the merchant can share on blink supported platforms (currently twitter) and then the users of that platform can directly add their details on the blink and pay directly through that blink without ever leaving twitter or supported platform.

**Challenges I ran into**
---
The major hurdle that I faced was turning the blinks into a mini shopping links. Most of the blinks available currently are just single action blinks. There were very very few examples releated to action chaining using blinks. Figuring this out consumed a major chunk of energy and time with the little resources available on the internet. But, now I've effortlessly created a chained automatic blink based on merchant inputs. So, the merchant can create as many number of blinks as possible.

Another major issue that consumed time was making PyUSD spl token work with blinks. Again blinks being a fairly new release, the resources are generic. There were very few resources to integrate blinks with spl-tokens and token-extensions. The transactions and creation of associated token accounts kept on failing for so much time. But, finally figured it out.

**For developers**
---
- **client** folder contains the UI code where the merchant enters their details and the product details to generate the blink.
- **backend** folder will be deleted soon. Not used as of now.
- **db-service** contains the MongoDB model and the solana-actions APIs. If you want to build action-chained blinks or blinks that support multiple steps or integrate spl-token transactions to blinks, this code will immensely help you.
