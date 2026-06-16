import { useEffect, useRef } from "react";

export default function OverheadCharges({ data, mode = "view", onChange }) {
  const valuesRef = useRef(JSON.parse(JSON.stringify(data)));

  useEffect(() => {
    valuesRef.current = JSON.parse(JSON.stringify(data));
  }, [data]);

  const commit = () => {
    onChange({ ...valuesRef.current });
  };

  const Input = ({ path, width = "w-16" }) => {
    const [key, field] = path;
    return (
      <input
        defaultValue={valuesRef.current[key][field]}
        className={`${width} border rounded px-2 py-1 text-[12px]
        focus:outline-none focus:ring-1 focus:ring-[#10BE3B]`}
        onChange={(e) => {
          valuesRef.current[key][field] = e.target.value;
        }}
        onBlur={commit}
      />
    );
  };

  const Row = ({ label, children }) => (
    <div className="flex justify-between items-center gap-3 px-3 py-2 last:border-b-0">
      <span className="text-[12px] font-[600] text-gray-600">
        {label}
      </span>
      <div className="text-[12px] font-[600] text-gray-800">
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border mt-4 shadow-sm">
      <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
        <h3 className="text-[13px] font-[700] text-gray-700">
          Overhead Charges
        </h3>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:grid grid-cols-2 gap-4 p-4">
        {/* LEFT */}
        <div className="border rounded-lg divide-y">
          <Row label="Pickup Charge">
            {mode === "view"
              ? `₹${data.pickupCharge.min} OR ${data.pickupCharge.value}%`
              : (
                <div className="flex items-center gap-2">
                  <Input path={["pickupCharge", "value"]} />
                  <span className="text-gray-500">%</span>
                  <Input path={["pickupCharge", "min"]} />
                </div>
              )}
          </Row>

          <Row label="Handling Charge">
            {mode === "view"
              ? `₹${data.handlingCharge.value}`
              : <Input path={["handlingCharge", "value"]} />}
          </Row>

          <Row label="COD Charges">
            {mode === "view"
              ? `${data.codCharges.value}% OR ₹${data.codCharges.min}`
              : (
                <div className="flex items-center gap-2">
                  <Input path={["codCharges", "value"]} />
                  <span className="text-gray-500">%</span>
                  <Input path={["codCharges", "min"]} />
                </div>
              )}
          </Row>

          <Row label="To Pay Charges (FOD)">
            {mode === "view"
              ? `₹${data.fodCharges.value}`
              : <Input path={["fodCharges", "value"]} />}
          </Row>

          <Row label="ROV Owner">
            {mode === "view"
              ? `${data.rovOwner.value}% OR ₹${data.rovOwner.min}`
              : (
                <div className="flex items-center gap-2">
                  <Input path={["rovOwner", "value"]} />
                  <span className="text-gray-500">%</span>
                  <Input path={["rovOwner", "min"]} />
                </div>
              )}
          </Row>

          <Row label="ROV Carrier">
            {mode === "view"
              ? `${data.rovCarrier.value}% OR ₹${data.rovCarrier.min}`
              : (
                <div className="flex items-center gap-2">
                  <Input path={["rovCarrier", "value"]} />
                  <span className="text-gray-500">%</span>
                  <Input path={["rovCarrier", "min"]} />
                </div>
              )}
          </Row>
        </div>

        {/* RIGHT */}
        <div className="border rounded-lg divide-y">
          <Row label="ODA Charge">
            {mode === "view"
              ? `₹${data.odaCharges.value}/Kg OR ₹${data.odaCharges.min}`
              : (
                <div className="flex items-center gap-2">
                  <Input path={["odaCharges", "value"]} />
                  <span className="text-gray-500">/Kg</span>
                  <Input path={["odaCharges", "min"]} />
                </div>
              )}
          </Row>

          <Row label="Fuel Charge">
            {mode === "view"
              ? `${data.fuelCharge.value}%`
              : <Input path={["fuelCharge", "value"]} />}
          </Row>

          <Row label="Docket Charge">
            {mode === "view"
              ? `₹${data.docketCharge.value}`
              : <Input path={["docketCharge", "value"]} />}
          </Row>

          <Row label="Appointment Delivery">
            {mode === "view"
              ? `₹${data.appointmentDelivery.value}`
              : <Input path={["appointmentDelivery", "value"]} />}
          </Row>

          <Row label="Green Tax">
            {mode === "view"
              ? `₹${data.greenTax.value}`
              : <Input path={["greenTax", "value"]} />}
          </Row>

          <Row label="Divisor">
            {mode === "view"
              ? data.divisor.value
              : <Input width="w-20" path={["divisor", "value"]} />}
          </Row>

          <Row label="Minimum Freight">
            {mode === "view"
              ? `₹${data.minimumFreight.value}`
              : <Input path={["minimumFreight", "value"]} />}
          </Row>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden p-3 space-y-2">
        {Object.entries(valuesRef.current).map(([key, val], i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-lg px-3 py-2 flex justify-between items-center"
          >
            <span className="text-[11px] font-[600] text-gray-600">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <span className="text-[12px] font-[700] text-gray-800">
              {typeof val === "object"
                ? `${val.value}${val.min ? ` / ₹${val.min}` : ""}`
                : val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
