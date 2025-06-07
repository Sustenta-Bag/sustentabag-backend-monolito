export default (req, res, next) => {
    /*
    #swagger.ignore = true
    */
    res.hateoasItem = (data) => {
        res.ok({
            ...data,
            _links: [
                { rel: "self", href: req.originalUrl, method: req.method },
                { rel: "list", href: req.baseUrl, method: "GET" },
                { rel: "update", href: `${req.baseUrl}/${req.params.id}`, method: "PUT" },
                { rel: "delete", href: `${req.baseUrl}/${req.params.id}`, method: "DELETE" },
                { rel: "updateStatus", href: `${req.baseUrl}/${req.params.id}/status`, method: "PATCH" }
            ],
        });
    }

    res.hateoasList = (data, totalPages) => {
        /* 
        #swagger.ignore = true
        */
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;

        res.ok({
            data: data.map((item) => ({
                ...item,
                _links: [
                    { rel: "self", href: `${req.baseUrl}/${item.id}`, method: "GET" },
                ],
            })),
            _page: {
                current: page,
                total: totalPages,
                size: data.length,
            },
            _links: [
                { rel: "self", href: req.baseUrl, method: req.method },
                { rel: "create", href: req.baseUrl, method: "POST" },
                { rel: "previous", href: page > 1 ? `${req.baseUrl}?page=${page - 1}&size=${size}` : null, method: req.method },
                { rel: "next", href: page < totalPages ? `${req.baseUrl}?page=${page + 1}&size=${size}` : null, method: req.method }
            ],
        });
    }

    next();
}