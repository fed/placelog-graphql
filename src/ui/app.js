import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/client";
import { loader } from "graphql.macro";
import data from "../places.json";

const getPlacesQuery = loader("../services/get-places.query.graphql");
const addPlacesMutation = loader("../services/add-places.mutation.graphql");
const addAttachmentsMutation = loader(
  "../services/add-attachments.mutation.graphql"
);

const Name = styled.p`
  font-weight: bold;
`;

const Description = styled.p``;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const App = () => {
  const {
    loading: isQueryLoading,
    error: isQueryError,
    data: queryData,
  } = useQuery(getPlacesQuery);

  const [
    addPlace,
    {
      data: addPlaceMutationData,
      loading: isAddPlaceMutationLoading,
      error: isAddPlaceMutationError,
    },
  ] = useMutation(addPlacesMutation, {
    refetchQueries: [getPlacesQuery],
  });

  const [
    addAttachment,
    {
      data: addAttachmentMutationData,
      loading: isAddAttachmentMutationLoading,
      error: isAddAttachmentMutationError,
    },
  ] = useMutation(addAttachmentsMutation, {
    refetchQueries: [getPlacesQuery],
  });

  if (isQueryLoading) return <p>Loading...</p>;
  if (isQueryError) return <p>Error</p>;

  const onClick = () => {
    data.places.forEach(async (p) => {
      await sleep(20000);

      console.log(`Adding place: ${p.name}`);

      const { data } = await addPlace({
        variables: {
          object: {
            name: p.name,
            description: p.description,
            visited: p.visited,
            lat: p.location.lat,
            lng: p.location.lng,
          },
        },
      });

      const placeId = data.insert_places_one.id;

      p.attachments.forEach(async (a) => {
        console.log(`Adding attachment: ${a.url}`);

        await addAttachment({
          variables: {
            object: {
              place_id: placeId,
              type: a.type,
              url: a.url,
            },
          },
        });
      });
    });
  };

  return (
    <div className="App">
      <button onClick={onClick}>Add place</button>
      {queryData.places.map((place) => (
        <div key={place.id}>
          <Name>{place.name}</Name>
          {place.description ? (
            <Description>{place.description}</Description>
          ) : null}
        </div>
      ))}
    </div>
  );
};
