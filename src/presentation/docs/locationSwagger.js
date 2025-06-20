/**
 * @swagger
 * tags:
 *   - name: Location
 *     description: Location-based operations
 * 
 * /api/location/nearby/{idAddress}:
 *   get:
 *     summary: Find businesses near an address
 *     description: Returns a list of nearby businesses based on an address ID
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: idAddress
 *         in: path
 *         description: ID of the reference address
 *         required: true
 *         schema:
 *           type: integer
 *       - name: radius
 *         in: query
 *         description: Search radius in kilometers
 *         required: false
 *         schema:
 *           type: number
 *           default: 10
 *       - name: limit
 *         in: query
 *         description: Maximum number of results to return
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of nearby businesses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of businesses found
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Business ID
 *                       name:
 *                         type: string
 *                         description: Business name
 *                       legalName:
 *                         type: string
 *                         description: Business legal name
 *                       logo:
 *                         type: string
 *                         description: URL to business logo
 *                       distance:
 *                         type: number
 *                         description: Distance in kilometers
 *                       address:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                           number:
 *                             type: string
 *                           city:
 *                             type: string
 *                           state:
 *                             type: string
 *                           zipCode:
 *                             type: string
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 * 
 * /api/location/geocode:
 *   post:
 *     summary: Geocode an address
 *     description: Convert an address to geographic coordinates
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 required: true
 *               number:
 *                 type: string
 *                 required: true
 *               city:
 *                 type: string
 *                 required: true
 *               state:
 *                 type: string
 *                 required: true
 *               zipCode:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Successfully geocoded address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 fullAddress:
 *                   type: string
 *       400:
 *         description: Invalid address data
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Server error or geocoding error
 * 
 * /api/location/nearby/client:
 *   get:
 *     summary: Find businesses near the logged-in client's address
 *     description: Returns a list of nearby businesses based on the address of the authenticated client.
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: radius
 *         in: query
 *         description: Search radius in kilometers
 *         required: false
 *         schema:
 *           type: number
 *           default: 10
 *       - name: limit
 *         in: query
 *         description: Maximum number of results to return
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of nearby businesses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       legalName:
 *                         type: string
 *                       logo:
 *                         type: string
 *                       distance:
 *                         type: number
 *                       address:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                           number:
 *                             type: string
 *                           city:
 *                             type: string
 *                           state:
 *                             type: string
 *                           zipCode:
 *                             type: string
 *       400:
 *         description: Client has no address
 *       401:
 *         description: Unauthorized - Authentication required or invalid token
 *       403:
 *         description: Forbidden - Access allowed only for clients
 */
