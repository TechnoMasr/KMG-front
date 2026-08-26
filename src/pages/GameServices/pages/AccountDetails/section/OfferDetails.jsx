const OfferDetails = ({ data }) => {
  return (
    <div className="card lg:p-8 space-y-4 lg:space-y-8">
      <h3 className="text-lg lg:text-2xl font-bold">وصف العرض</h3>

      <div
        className="p-4 bg-accent rounded-2xl rich_content"
        dangerouslySetInnerHTML={{ __html: data?.offer_desc }}
      />

      <div
        className="p-4 bg-accent rounded-2xl rich_content"
        dangerouslySetInnerHTML={{ __html: data?.offer_notes }}
      />
    </div>
  );
};

export default OfferDetails;
