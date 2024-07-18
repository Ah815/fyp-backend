const Vendor = require("../models/Vendor");

module.exports = {
  addVendor: async (req, res) => {
    const newVendor = new Vendor(req.body);
    try {
      await newVendor.save();
      res
        .status(201)
        .json({ status: true, message: "Vendor created sucessfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: "Vendor not created" });
    }
  },

  // serviceAvaibility: async (req, res) => {
  //   const vendorId = req.params.id;
  //   console.log(`this is vendor ID:`, vendorId)
  //   try {
  //     const vendor = await Vendor.findById(vendorId);
  //     if (!vendor) {
  //       return res
  //         .status(403)
  //         .json({ status: false, message: "Vendor not found" });
  //     }
  //     vendor.isAvailiable = !vendor.isAvaliable;
  //     await Vendor.save();
  //     res.status(200).json({
  //       status: true,
  //       message: "Vendor is now available",
  //       isAvailiable: vendor.isAvailiable,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       status: false,
  //       message: "Error toggling vendor availability",
  //     });
  //   }
  // },
   serviceAvaibility : async (req, res) => {
    const vendorId = req.params.id;
    console.log(`This is vendor ID:`, vendorId);
  
    try {
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ status: false, message: "Vendor not found" });
      }
  
      vendor.isAvailable = !vendor.isAvailable; // Toggle availability
      await vendor.save(); // Save the updated vendor document
  
      res.status(200).json({
        status: true,
        message: `Vendor is now ${vendor.isAvailable ? 'available' : 'unavailable'}`,
        isAvailable: vendor.isAvailable,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error toggling vendor availability",
      });
    }
  },

  deleteVendor: async (req, res) => {
    const vendorId = req.params.id;

    try {
      const vendor = await Vendor.finDByIdAndDelete(vendorId);
      if (!vendor) {
        return res
          .status(403)
          .json({ status: false, message: "Vendor not found" });
      }
      await Vendor.findByIdAndDelete(vendorId);
      res
        .status(200)
        .json({ status: true, message: "Vendor sucaeefully Deleted" });
    } catch (error) {
      res.status(500).json({ status: false, message: "Error deleting vendor" });
    }
  },

  getVendor: async (req, res) => {
    const vendorId = req.params.id;
    try {
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res
          .status(404)
          .json({ status: false, message: "Vendor not found" });
      }
      res.status(200).json(vendor);
    } catch (error) {
      res.status(500).json({ status: false, message: "Error getting vendor" });
    }
  },
  // getRandomVendor: async (req, res) => {
  //   try {
  //     let randomVendor = [];
  //     if (req.params.code) {
  //       randomVendor = await Vendor.aggregate([
  //         { $match: { code: req.params.code } },
  //         { $sample: { size: 5 } },
  //         { $project: { __v: 0 } },
  //       ]);
  //     }
  
  //     // If no vendors found with the specified code or no code provided, get random vendors
  //     if (!randomVendor.length) {
  //       randomVendor = await Vendor.aggregate([
  //         { $sample: { size: 5 } },
  //         { $project: { __v: 0 } },
  //       ]);
  //     }
  
  //     if (randomVendor.length) {
  //       res.status(200).json(randomVendor);
  //     } else {
  //       res.status(404).json({ status: false, message: "No vendors found" });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: "Error getting random vendor", error });
  //   }
  // },

  // getRandomVendor: async (req, res) => {
  //   try {
  //     let randomVendor = [];
  //     if (req.params.code) {
  //       randomVendor = await Vendor.aggregate([
  //         { $match: { code: req.params.code } },
  //         { $sample: { size: 5 } },
  //         { $project: { __v: 0 } },
  //       ]);
  //     }
  //     if (!randomVendor.length) {
  //       randomVendor = await Vendor.aggregate([
  //         { $sample: { size: 5 } },
  //         { $project: { __v: 0 } },
  //       ]);
  //     }
  //     if (randomVendor.length) {
  //       res.status(200).json(randomVendor);
  //     }
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ status: false, message: "Error getting random vendor" });
  //   }
  // }

   getRandomVendor : async (req, res) => {
    try {
      let randomVendor = [];
  
      if (req.params.code) {
        randomVendor = await Vendor.aggregate([
          { $match: { code: req.params.code } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
        console.log('sample found')
      }
  
      if (!randomVendor.length) {
        randomVendor = await Vendor.aggregate([
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
        console.log('sample not found, giving off random data')
      }
  
      if (randomVendor.length) {
        res.status(200).json(randomVendor);
      } else {
        res.status(404).json({ status: false, message: "No vendors found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error getting random vendors" });
    }
  },
  
};
