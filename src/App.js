import { useEffect, useState } from "react";
import "./App.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

function App() {
  const [category, setCategory] = useState([]);
  const [cloading, setcloading] = useState(true);

  const [food, setFood] = useState([]);
  const [floading, setfloading] = useState(true);

  const [allFood, setAllFood] = useState([]);
  const [allfoodloading, setallfoodloading] = useState(true);

  const [foodDetails, setFoodDetails] = useState({});
  const [fdloading, setfdloading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const getCategory = async () => {
    try {
      setcloading(true);
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await res.json();
      if (data.categories) {
        setCategory(data.categories);
        const randomElement =
          data.categories[Math.floor(Math.random() * data.categories.length)];
        getFood(randomElement.strCategory);
        getAllFood(data.categories);
      } else {
        window.location.reload();
      }
    } catch (error) {
      window.location.reload();
    }
    setcloading(false);
  };

  const getFood = async (id) => {
    try {
      setfloading(true);
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${id}`
      );
      const data = await res.json();
      if (data.meals) {
        setFood(data.meals);
      }
    } catch (error) {
      console.log(error);
    }
    setfloading(false);
  };

  const getAllFood = async (catlist) => {
    let allFood = [];
    setallfoodloading(true);
    for (const cat of catlist) {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat.strCategory}`
      );
      const data = await res.json();
      if (data.meals) {
        if (data.meals.length) {
          data.meals.map((v) => {
            allFood.push(v);
          });
        }
      }
    }
    setAllFood(allFood);
    setallfoodloading(false);
  };
  function getRandom(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
  const getRandomFood = (e) => {
    e.preventDefault();
    const data = getRandom(allFood, e.target.num.value);
    setFood(data);
  };

  const getFoodDetails = async (id) => {
    setIsOpen(true);
    setfdloading(true);
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    if (data.meals.length) {
      setFoodDetails(data.meals[0]);
    }
    setfdloading(false);
  };

  useEffect(() => {
    getCategory();
  }, []);
  return (
    <>
      <div className="container mx-auto px-6 py-3 bg-white min-h-screen">
        <header>
          <div className="flex items-center justify-center p-4">
            <div class="logo-holder logo-6">
              <a href="">
                <h1>
                  Random Food<span>Generator</span>
                </h1>
              </a>
            </div>
          </div>
        </header>

        <main className="my-8">
          <div className="container mx-auto px-6">
            <div>
              <form
                className="flex items-center bg-white text-center sm:w-96 w-full mx-auto"
                onSubmit={getRandomFood}
              >
                {!allfoodloading ? (
                  <>
                    <input
                      className="text-base text-gray-400 flex-grow outline-none px-2 md:w-24 rounded-lg overflow-hidden px-2 py-1 justify-between border-2"
                      type="number"
                      placeholder="How many recipes?"
                      required
                      max={allFood.length}
                      name="num"
                    />
                    <div className="ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                      <button
                        className="bg-red-500 text-white text-base rounded-lg px-4 py-2 font-thin "
                        type="submit"
                      >
                        Show
                      </button>
                    </div>
                  </>
                ) : (
                  <Skeleton width={300} height={60} />
                )}
              </form>
              <div className="col-span-6 sm:col-span-4 sm:w-96 w-full mx-auto my-4">
                <select
                  id="vehicle_id"
                  name="vehicle_id"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-red-500 sm:text-sm"
                  onChange={(e) => getFood(e.target.value)}
                >
                  {cloading ? (
                    <option disabled selected>
                      Loading...
                    </option>
                  ) : (
                    <option disabled selected>
                      Select food category
                    </option>
                  )}

                  {category.map((v) => (
                    <option value={v.strCategory} key={v.idCategory}>
                      {v.strCategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
              {floading ? (
                <>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                </>
              ) : (
                food.map((v) => (
                  <div
                    className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
                    key={v.idMeal}
                  >
                    <div
                      className="flex items-end justify-end h-56 w-full bg-cover"
                      style={{
                        backgroundImage: `url("${v.strMealThumb}")`,
                      }}
                    ></div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <h3 className="text-gray-700 ">{v.strMeal}</h3>
                      <button
                        onClick={() => getFoodDetails(v.idMeal)}
                        className=" pl-5 pr-5 bg-green-500 text-gray-100 text-lg rounded-lg focus:border-4 border-green-300 my-1"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="my-12 font-weight-normal">
            <h2 className="text-3xl font-semibold  text-gray-800 dark:text-gray-200">
              Random food picker
            </h2>
            <p className="text-justify my-4">
              Do you want to enjoy a good dessert? This food wheel picker can
              suggest to you the sweetest cake or the handiest pie. The food
              generator contains the most loved dishes from international
              cuisine. You can find Italian pizza or spaghetti, but you can also
              find hamburgers.
            </p>
            <p className="text-justify my-4">
              Some of these meals are considered traditional in the origin
              countries, but globalization transforms them into fast food. Each
              food shows you an image of it so you can make an idea about it.
            </p>
            <p className="text-justify my-4">
              What can you do with a random food generator? The first thing that
              comes to mind is to have the generator decide what your next meal
              should be. But if that's too risky for you, there's a lot of
              things that you can do with a site that can suggest random food to
              you, especially since it isn't limited to one region or culture.
            </p>
            <p className="text-justify my-4">
              For example, the random food generator actually suggests several
              recipes you're not familiar with, and that could be an educational
              moment. Or, if you're not decided on what to prepare for
              Thanksgiving, you can get suggestions that are completely out of
              the box. You could find out more about the food, look up recipes
              online, and surprise the entire family.
            </p>
            <p className="text-justify my-4">
              If you're still not convinced, here are the three best ways to
              make full use of a random food generator.
            </p>
            <ol className="my-4">
              <li className="font-semibold my-2">
                Get suggestions for your food blog or vlog
                <p className="font-normal">
                  If you own a food blog or vlog, chances are you've already
                  tried cooking almost every dish that you know plus a few more.
                  There are a limited number of trendy food dishes out there so
                  why not try to start a new one with the random food
                  generator's help?
                </p>
                <p className="font-normal my-2">
                  You can set the number of food to be generated as high or as
                  few as you need. And if you don't find a dish that grabs your
                  interest, click generate again and find more dishes to choose
                  from! At the very least, it will get you out of a creative
                  stalemate if you're in one.
                </p>
              </li>
              <li className="font-semibold my-2">
                Test your food knowledge
                <p className="font-normal">
                  Maybe you're a chef or a food hygiene instructor or perhaps
                  you're just really enthusiastic about food. Either way, the
                  random food generator is a great way to test your knowledge.
                  Try to see how many of the dishes you'll recognize. Bonus
                  points if you can name the country of origin too.
                </p>
              </li>
              <li className="font-semibold my-2">
                Find the next dish you're going to cook, just for fun
                <p className="font-normal">
                  The easiest and most fun way of using the random food
                  generator? Let it choose the next dish you're cooking - and
                  eating - next. It may not be as fancy as finding food to
                  feature in your blog or testing your food knowledge, but it'll
                  deliver both a good time and a full stomach.
                </p>
              </li>
            </ol>
          </div>
        </main>
      </div>
      <footer className="bg-gray-200">
        <div className="mx-auto px-6 py-3 flex justify-center items-center">
          <p className="py-2 text-gray-500 sm:py-0">All rights reserved</p>
        </div>
      </footer>

      <Modal
        //trigger={<button className="button"> Open Modal </button>}

        open={isOpen}
        onClose={() => setIsOpen(false)}
        style={{ maxHeight: "90vh", overflowX: "hidden" }}
      >
        <div className="modal">
          {/* <button className="close" onClick={() => setIsOpen(false)}>
            &times;
          </button> */}
          {fdloading ? (
            <>
              <h2 className="sm:text-2xl text-xl font-semibold header">
                <Skeleton width={200} height={20} />
              </h2>
              <div className="mt-4">
                <ul>
                  <Skeleton count={2} />
                </ul>
                <div className="flex items-end justify-end h-96 w-full bg-cover mt-4 rounded-md overflow-hidden">
                  <Skeleton height={384} width={1000} />
                </div>
                <h3 className="text-center text-xl pt-4 font-semibold">
                  Ingredients
                </h3>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                    </div>
                  </div>
                  <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                    <div className="flex items-end justify-end h-56 w-full bg-cover">
                      <Skeleton
                        className="w-full h-56"
                        height="224"
                        width={400}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-center flex-col">
                      <Skeleton width={100} />
                    </div>
                  </div>
                </div>
                <h3 className="text-center text-xl pt-4 font-semibold">
                  Instructions
                </h3>
                <div className="content">
                  {" "}
                  <Skeleton />
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="sm:text-2xl text-xl font-semibold header">
                {foodDetails.strMeal}
              </h2>
              <div className="mt-4">
                <ul>
                  {foodDetails.strCategory ? (
                    <li>
                      Category: <b>{foodDetails.strCategory}</b>
                    </li>
                  ) : null}
                  {foodDetails.strArea ? (
                    <li>
                      Area: <b>{foodDetails.strArea}</b>
                    </li>
                  ) : null}
                </ul>
                <div
                  className="flex items-end justify-end h-96 w-full bg-cover mt-4 rounded-md overflow-hidden"
                  style={{
                    backgroundImage: `url("${foodDetails.strMealThumb}")`,
                  }}
                ></div>
                <h3 className="text-center text-xl pt-4 font-semibold">
                  Ingredients
                </h3>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                  {[...Array(20).keys()].map((v, key) => (
                    <>
                      {foodDetails["strMeasure" + key] &&
                      foodDetails["strIngredient" + key] ? (
                        <div
                          className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
                          key={key}
                        >
                          <div
                            className="flex items-end justify-end h-56 w-full bg-cover"
                            style={{
                              backgroundImage: `url("https://www.themealdb.com/images/ingredients/${
                                foodDetails["strIngredient" + key]
                              }.png")`,
                            }}
                          ></div>
                          <div className="px-5 py-3 flex items-center justify-center flex-col">
                            <h3 className="text-gray-700 ">
                              {foodDetails["strMeasure" + key]}
                            </h3>
                          </div>
                        </div>
                      ) : null}
                    </>
                  ))}
                </div>
                <h3 className="text-center text-xl pt-4 font-semibold">
                  Instructions
                </h3>
                <div className="content">
                  {" "}
                  <p className="text-center">{foodDetails.strInstructions}</p>
                </div>
                {foodDetails.strYoutube ? (
                  <>
                    <h3 className="text-center text-xl pt-4 font-semibold">
                      Youtube Video
                    </h3>
                    <div className="mx-auto">
                      <LiteYouTubeEmbed
                        id={foodDetails.strYoutube.split("=")[1]}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

export default App;
