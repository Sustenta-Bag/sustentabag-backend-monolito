// import { Router } from 'express';
// import AddressController from '../controllers/addressController.js';
// import AddressService from '../../application/services/AddressService.js';
// import LocationService from '../../application/services/LocationService.js';
// import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
// import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
// import PostgresClientRepository from '../../infrastructure/repositories/PostgresClientRepository.js';
// import {
//   validateCreateAddress,
//   validateUpdateAddress,
//   validateAddressId,
// } from '../middleware/addressValidation.js';

// export default (options = {}) => {
//   const addressRepository = options.addressRepository || new PostgresAddressRepository();
//   const businessRepository = options.businessRepository || new PostgresBusinessRepository();
//   const clientRepository = options.clientRepository || new PostgresClientRepository();

//   const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
//   const locationService = new LocationService(
//     businessRepository,
//     addressRepository,
//     clientRepository,
//     mapboxToken
//   );

//   const addressService = new AddressService(addressRepository, locationService);
//   const addressController = new AddressController(addressService);

//   const router = Router();

//   router.post('/',
//     /*
//     #swagger.tags = ["Address"]
//     #swagger.security = [{ "bearerAuth": [] }]
//     #swagger.requestBody = {
//     required: true,
//     schema: { $ref: '#components/schemas/AddressInput' },
//     }
//     #swagger.responses[201]
//     #swagger.responses[401] = {
//     description: "Unauthorized - Authentication required or invalid token",
//     schema: { $ref: "#/components/schemas/Error" }
//     }
//     */
//     validateCreateAddress,
//     addressController.createAddress.bind(addressController)
// );

//   router.get('/',
//     /*
//     #swagger.tags = ["Address2"]
//     #swagger.security = [{ "bearerAuth": [] }]
//     #swagger.responses[200]
//     #swagger.responses[401] = {
//     description: "Unauthorized - Authentication required or invalid token",
//     schema: { $ref: "#/components/schemas/Error" }
//     }
//     */
//     addressController.listAddresses.bind(addressController)
// );

//   router.get(
//     /*
//     #swagger.tags = ["Address"]
//     #swagger.security = [{ "bearerAuth": [] }]
//     #swagger.responses[200]
//     #swagger.responses[401] = {
//         description: "Unauthorized - Authentication required or invalid token",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     #swagger.responses[404] = {
//         description: "Not Found - Address not found",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     */
//     `/:id`,
//     validateAddressId,
//     addressController.getAddress.bind(addressController)
// );

//   router.put(
//     /*
//     #swagger.tags = ["Address"]
//     #swagger.security = [{ "bearerAuth": [] }]
//     #swagger.requestBody = {
//         required: true,
//         schema: { $ref: '#components/schemas/AddressInput' },
//     }
//     #swagger.responses[200]
//     #swagger.responses[401] = {
//         description: "Unauthorized - Authentication required or invalid token",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     #swagger.responses[403] = {
//         description: "Forbidden - Insufficient permissions",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     #swagger.responses[404] = {
//         description: "Not Found - Address not found",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     */
//     `/:id`,
//     validateUpdateAddress,
//     addressController.updateAddress.bind(addressController)
// );

//   router.delete(
//     /*
//     #swagger.tags = ["Address"]
//     #swagger.security = [{ "bearerAuth": [] }]
//     #swagger.responses[204]
//     #swagger.responses[401] = {
//         description: "Unauthorized - Authentication required or invalid token",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     #swagger.responses[403] = {
//         description: "Forbidden - Insufficient permissions",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     #swagger.responses[404] = {
//         description: "Not Found - Address not found",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     */
//     `/:id`,
//     validateAddressId,
//     addressController.deleteAddress.bind(addressController)
// );

//   router.patch(
//     /*
//     #swagger.tags = ["Address"]
//     #swagger.security = [{ "bearerAuth": [] }]
//     #swagger.requestBody = {
//         required: true,
//         schema: { $ref: '#components/schemas/UpdateStatus' },
//     }
//     #swagger.responses[200]
//     #swagger.responses[401] = {
//         description: "Unauthorized - Authentication required or invalid token",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     #swagger.responses[403] = {
//         description: "Forbidden - Insufficient permissions",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     #swagger.responses[404] = {
//         description: "Not Found - Address not found",
//         schema: { $ref: "#/components/schemas/Error" }
//     }
//     */
//     `/:id/status`,
//     addressController.updateAddressStatus.bind(addressController)
// );

//   return router;
// };