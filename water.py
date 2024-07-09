from flask import Flask, jsonify, request
from flask_cors import CORS
import plotly.graph_objects as go
import plotly.io as pio
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/plot')
def plot():
    fig = go.Figure()

    tanks = ['Fresh Water', 'WHO\'s Upper Limit', 'Palestine\'s Water', 'Sea Water']
    salt_content = [100, 200, 3000, 3500]
    tank_spacing = 1.5  
    tank_width = 2    
    margin = tank_spacing

    for i, (tank, salt) in enumerate(zip(tanks, salt_content)):
        x0 = margin + i * (tank_width + tank_spacing)
        x1 = x0 + tank_width
        tank_height = 4000

        fig.add_shape(type='line', x0=x0, y0=0, x1=x0, y1=tank_height, line=dict(color='gray', width=2))
        fig.add_shape(type='line', x1=x1, y0=0, x0=x1, y1=tank_height, line=dict(color='gray', width=2))
        fig.add_shape(type='line', x0=x0, y0=0, x1=x1, y1=0, line=dict(color='gray', width=2))

        x_wave = np.linspace(x0, x1, 100)
        y_wave = (tank_height - 100) + 70 * np.sin(6 * np.pi * (x_wave - x0) / (x1 - x0))
        x_fill = np.concatenate([x_wave, [x1, x0]])
        y_fill = np.concatenate([y_wave, [0, 0]])

        fig.add_trace(go.Scatter(x=x_fill, y=y_fill, mode='lines', line=dict(color='cornflowerblue'), fill='toself', fillcolor='cornflowerblue', showlegend=False, hoverinfo='none'))

        y_positions = np.linspace(0, salt, salt)
        x_positions = np.random.uniform(x0, x1, salt)
        fig.add_trace(go.Scatter(x=x_positions, y=y_positions, mode='markers',
                                 marker=dict(color='white', size=2.5), showlegend=False,
                                 hoverinfo='none'))

        fig.add_trace(go.Scatter(
            x=np.random.uniform(x0, x1, 500),
            y=np.random.uniform(0, tank_height, 500),
            mode='markers',
            marker=dict(size=0.1, color='rgba(0,0,0,0)'),
            hoverinfo='text',
            text=[f'{tank}: In 1 litre of water there are {salt} mg salt'] * 500,
            showlegend=False
        ))

    fig.update_layout(
        title='Water Tanks with Salt Content',
        xaxis=dict(
            title='Types of water', 
            tickvals=[margin + i * (tank_width + tank_spacing) + tank_width / 2 for i in range(len(tanks))], 
            ticktext=tanks,
            showline=True,  
            linecolor='white',  # Set x-axis line color to white
            linewidth=2,
            showgrid=False  # Remove x-axis gridlines
        ),
        yaxis=dict(
            title='Salt Content (mg/L)', 
            tickvals=list(range(0, 4000, 500)), 
            range=[0, 4000],
            showline=True,  
            linecolor='white',  # Set y-axis line color to white
            linewidth=2,
            showgrid=False  # Remove y-axis gridlines
        ),
        showlegend=False,
        plot_bgcolor='#27293D',  # Set plot background color
        paper_bgcolor='#27293D',  # Set paper background color
        font=dict(color='white'),  # Set all text color to white
        hoverlabel=dict(bgcolor="white")  # Set hover label background color
    )

    fig_json = pio.to_json(fig)
    return jsonify(fig_json)

@app.route('/water_tank_plot')
def water_tank_plot():
    modes = {
        "Before War": 88,
        "After War": 3
    }

    tank_spacing = 1.5
    tank_width = 2
    margin = 0
    tank_height = 100

    total_duration = 3000
    frames_count = 10

    fig = go.Figure()

    def add_tank_and_water(fig, water_level, x0, x1, tank_height, tank_width, show_label=False):
        fig.add_shape(type='line', x0=x0, y0=0, x1=x0, y1=tank_height, line=dict(color='gray', width=2))
        fig.add_shape(type='line', x0=x1, y0=0, x1=x1, y1=tank_height, line=dict(color='gray', width=2))
        fig.add_shape(type='line', x0=x0, y0=0, x1=x1, y1=0, line=dict(color='gray', width=2))

        y_fill = [0, (tank_height / 100) * water_level, (tank_height / 100) * water_level, 0]
        x_fill = [x0, x0, x1, x1]

        fig.add_trace(go.Scatter(
            x=x_fill,
            y=y_fill,
            mode='lines',
            line=dict(color='cornflowerblue'),
            fill='toself',
            fillcolor='cornflowerblue',
            showlegend=False,
            hoverinfo='text',
            text=[f'Water Level: {water_level} L'] * 4
        ))

        fig.add_trace(go.Scatter(
            x=np.random.uniform(x0, x1, 500),
            y=np.random.uniform(0, tank_height, 500),
            mode='markers',
            marker=dict(size=0.1, color='rgba(0,0,0,0)'),
            hoverinfo='text',
            text=[f'Water Level: {water_level} L'] * 500,
            showlegend=False
        ))

        if show_label:
            fig.add_annotation(
                x=x0 + tank_width / 2,
                y=(tank_height / 100) * water_level,
                text=f"{water_level} L",
                showarrow=False,
                font=dict(color='white')
            )

    x0 = margin
    x1 = x0 + tank_width

    add_tank_and_water(fig, modes["Before War"], x0, x1, tank_height, tank_width, show_label=False)

    fig.update_layout(
        title=dict(
            text='Water Tank in Gaza Before and After War',
            font=dict(color='white')
        ),
        xaxis=dict(
            title=dict(
                text='Water Availability in Gaza per Person per Day',
                font=dict(color='white')
            ),
            showline=False,
            showticklabels=False,
            range=[x0, x1 + 0.1],
            linecolor='white',
            linewidth=2,
            showgrid=False
        ),
        yaxis=dict(
            title=dict(
                text='Water Level (L)',
                font=dict(color='white')
            ),
            tickvals=list(range(0, tank_height + 1, 10)),
            ticktext=[str(int(i * (100 / tank_height))) for i in range(0, tank_height + 1, 10)],
            range=[0, tank_height],
            showline=True,
            linecolor='white',
            linewidth=2,
            showgrid=False
        ),
        font=dict(color='white'),
        showlegend=False,
        plot_bgcolor='#27293D',
        paper_bgcolor='#27293D',
        hoverlabel=dict(bgcolor="white"),
        updatemenus=[
            {
                "buttons": [
                    {
                        "label": "Gaza in 2024",
                        "method": "animate",
                        "args": [
                            [f'frame_{level:.1f}' for level in np.linspace(modes["Before War"], modes["After War"], num=frames_count)],
                            {"frame": {"duration": total_duration / frames_count, "redraw": True}, "mode": "immediate"}
                        ]
                    },
                    {
                        "label": "Gaza Before War",
                        "method": "animate",
                        "args": [
                            [f'frame_{level:.1f}' for level in np.linspace(modes["After War"], modes["Before War"], num=frames_count)],
                            {"frame": {"duration": total_duration / frames_count, "redraw": True}, "mode": "immediate"}
                        ]
                    }
                ],
                "direction": "left",
                "pad": {"r": 10, "t": 87},
                "showactive": True,
                "type": "buttons",
                "x": 0.5,
                "xanchor": "center",
                "y": 1.1,
                "yanchor": "top",
                "bgcolor": "#27293D",
                "bordercolor": "cornflowerblue",
                "font": {"color": "cornflowerblue"}
            }
        ]
    )

    frames = []

    # Define frames for animation
    water_levels_to_after_war = np.linspace(modes["Before War"], modes["After War"], num=frames_count)
    for level in water_levels_to_after_war:
        frames.append(
            go.Frame(
                data=[
                    go.Scatter(
                        x=[x0, x0, x1, x1],
                        y=[0, (tank_height / 100) * level, (tank_height / 100) * level, 0],
                        mode='lines', line=dict(color='cornflowerblue'), fill='toself', fillcolor='cornflowerblue', showlegend=False, hoverinfo='text',
                        text=[f'Water Level: {level:.1f} L']*4
                    ),
                    go.Scatter(
                        x=np.random.uniform(x0, x1, 500),
                        y=np.random.uniform(0, tank_height, 500),
                        mode='markers',
                        marker=dict(size=0.1, color='rgba(0,0,0,0)'),
                        hoverinfo='text',
                        text=[f'Water Level: {level:.1f} L'] * 500,
                        showlegend=False
                    )
                ],
                name=f'frame_{level:.1f}'
            )
        )

    fig.frames = frames

    fig_json = pio.to_json(fig)
    return jsonify(fig_json)





@app.route('/water_availability_gaza_plot')
def water_availability_gaza_plot():
    data = [88, 3, 7.5]
    labels = ['Gaza before War', 'Gaza in 2024', "WHO's emergency minimum"]

    hover_text = [
        'Gaza before War: 88L Daily Water Availability per Capita',
        'Gaza in 2024: 3L Daily Water Availability per Capita',
        "WHO's emergency minimum: 7.5L Daily Water Availability per Capita"
    ]

    initial_shapes = []
    for idx, label in enumerate(labels):
        initial_shapes.extend([
            dict(type="line", x0=idx - 0.4, x1=idx + 0.4, y0=0, y1=0, line=dict(color="gray", width=2)),
            dict(type="line", x0=idx - 0.4, x1=idx - 0.4, y0=0, y1=100, line=dict(color="gray", width=2)),
            dict(type="line", x0=idx + 0.4, x1=idx + 0.4, y0=0, y1=100, line=dict(color="gray", width=2))
        ])

        initial_shapes.extend([
            dict(type="rect", x0=idx - 0.1, x1=idx + 0.1, y0=100, y1=105, fillcolor="gray", line=dict(color="gray", width=2)),
            dict(type="rect", x0=idx - 0.2, x1=idx + 0.2, y0=105, y1=107, fillcolor="gray", line=dict(color="gray", width=2))
        ])

    second_faucet_center_x = 1
    width_rect = 0.03
    second_faucet_shape = dict(type="rect", x0=second_faucet_center_x - width_rect / 2, x1=second_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    third_faucet_center_x = 2
    width_rect = 0.05
    third_faucet_shape = dict(type="rect", x0=third_faucet_center_x - width_rect / 2, x1=third_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    first_faucet_center_x = 0
    width_rect = 0.1
    first_faucet_shape = dict(type="rect", x0=first_faucet_center_x - width_rect / 2, x1=first_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    frames = []
    num_frames = 50

    for i in range(num_frames + 1):
        current_heights = [val * (i / num_frames) for val in data]

        if i == 0:
            second_faucet_shape['y1'] = 100

        if i == 0:
            third_faucet_shape['y1'] = 100

        if i == 0:
            first_faucet_shape['y1'] = 100

        if i == num_frames:
            first_faucet_shape['y1'] = 0
            second_faucet_shape['y1'] = 0
            third_faucet_shape['y1'] = 0

        frame = go.Frame(
            data=[go.Bar(x=labels, y=current_heights, marker_color='cornflowerblue', width=0.8, hovertext=hover_text, hoverinfo='text')],
            name=str(i),
            layout=go.Layout(
                title="Water Availability in Gaza",
                xaxis_title="Situation",
                yaxis_title="Liters per Capita per Day",
                xaxis=dict(showline=True, linewidth=2, linecolor='white', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='white', showgrid=False),
                yaxis=dict(showline=True, linewidth=2, linecolor='white', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='white', showgrid=False),
                template="plotly_white",
                barmode='overlay',
                plot_bgcolor='#27293D',
                paper_bgcolor='#27293D',
                font=dict(color='white'),
                shapes=initial_shapes + [third_faucet_shape] + [first_faucet_shape] + [second_faucet_shape]
            )
        )
        frames.append(frame)

    fig = go.Figure(
        data=[go.Bar(x=labels, y=[0, 0, 0], marker_color='cornflowerblue', width=0.8, hovertext=hover_text, hoverinfo='text')],
        layout=go.Layout(
            title="Water Availability in Gaza Before and After War and WHO's Emergency Minimum",
            xaxis_title="Situation",
            yaxis_title="Liters per Capita per Day",
            xaxis=dict(showline=True, linewidth=2, linecolor='white', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='white', showgrid=False),
            yaxis=dict(showline=True, linewidth=2, linecolor='white', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='white', showgrid=False),
            template="plotly_white",
            barmode='overlay',
            plot_bgcolor='#27293D',
            paper_bgcolor='#27293D',
            font=dict(color='white'),
            shapes=initial_shapes
        ),
        frames=frames
    )

    fig.update_traces(hoverlabel=dict(bgcolor="white"))

    fig.update_layout(
        updatemenus=[
            {
                "buttons": [
                    {
                        "args": [None, {"frame": {"duration": 50, "redraw": True}, "fromcurrent": True}],
                        "label": "Turn on the faucets",
                        "method": "animate"
                    },
                    {
                        "args": [[None], {"frame": {"duration": 0, "redraw": True}, "mode": "immediate", "transition": {"duration": 0}}],
                        "label": "Turn off the faucets",
                        "method": "animate"
                    }
                ],
                "direction": "left",
                "pad": {"r": 10, "t": 87},
                "showactive": True,
                "type": "buttons",
                "x": 0.5,
                "xanchor": "center",
                "y": 0,
                "yanchor": "top",
                "bgcolor": "#27293D",  # Background color of the button
                "bordercolor": "cornflowerblue",  # Border color of the button
                "font": {"color": "cornflowerblue"}  # Text color of the button
            }
        ]
    )

    fig_json = pio.to_json(fig)
    return jsonify(fig_json)



@app.route('/water_availability_world_plot')
def water_availability_world_plot():
    data = [812, 75.7, 100, 535.7, 1383.8, 1197.1, 1239.6, 2399.4, 2172.7]
    labels = ['Israel', 'Palestine', "WHO's minimum", 'Africa', 'Oceania', 'Europe', 'North America', 'South America', 'Asia']

    hover_text = [
        'Israel: 812L Daily Water Availability per Capita',
        'Palestine: 75.7L Daily Water Availability per Capita',
        "WHO's minimum: 100L Daily Water Availability per Capita",
        'Africa: 535.7L Daily Water Availability per Capita',
        'Oceania: 1383.8L Daily Water Availability per Capita',
        'Europe: 1197.1L Daily Water Availability per Capita',
        'North America: 1239.6L Daily Water Availability per Capita',
        'South America: 2399.4L Daily Water Availability per Capita',
        'Asia: 2172.7L Daily Water Availability per Capita'
    ]

    initial_shapes = []
    for idx, label in enumerate(labels):
        initial_shapes.extend([
            dict(type="line", x0=idx - 0.4, x1=idx + 0.4, y0=0, y1=0, line=dict(color="gray", width=2)),
            dict(type="line", x0=idx - 0.4, x1=idx - 0.4, y0=0, y1=2500, line=dict(color="gray", width=2)),
            dict(type="line", x0=idx + 0.4, x1=idx + 0.4, y0=0, y1=2500, line=dict(color="gray", width=2))
        ])

        initial_shapes.extend([
            dict(type="rect", x0=idx - 0.1, x1=idx + 0.1, y0=2500, y1=2550, fillcolor="gray", line=dict(color="gray", width=2)),
            dict(type="rect", x0=idx - 0.2, x1=idx + 0.2, y0=2550, y1=2570, fillcolor="gray", line=dict(color="gray", width=2))
        ])

    second_faucet_center_x = 1
    width_rect = 0.03
    second_faucet_shape = dict(type="rect", x0=second_faucet_center_x - width_rect / 2, x1=second_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    third_faucet_center_x = 2
    width_rect = 0.05
    third_faucet_shape = dict(type="rect", x0=third_faucet_center_x - width_rect / 2, x1=third_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    first_faucet_center_x = 0
    width_rect = 0.2
    first_faucet_shape = dict(type="rect", x0=first_faucet_center_x - width_rect / 2, x1=first_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    fourth_faucet_center_x = 3
    width_rect = 0.15
    fourth_faucet_shape = dict(type="rect", x0=fourth_faucet_center_x - width_rect / 2, x1=fourth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    fifth_faucet_center_x = 4
    width_rect = 0.15
    fifth_faucet_shape = dict(type="rect", x0=fifth_faucet_center_x - width_rect / 2, x1=fifth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    sixth_faucet_center_x = 5
    width_rect = 0.15
    sixth_faucet_shape = dict(type="rect", x0=sixth_faucet_center_x - width_rect / 2, x1=sixth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    seventh_faucet_center_x = 6
    width_rect = 0.15
    seventh_faucet_shape = dict(type="rect", x0=seventh_faucet_center_x - width_rect / 2, x1=seventh_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    eighth_faucet_center_x = 7
    width_rect = 0.15
    eighth_faucet_shape = dict(type="rect", x0=eighth_faucet_center_x - width_rect / 2, x1=eighth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    ninth_faucet_center_x = 8
    width_rect = 0.15
    ninth_faucet_shape = dict(type="rect", x0=ninth_faucet_center_x - width_rect / 2, x1=ninth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="cornflowerblue", line=dict(color="cornflowerblue", width=0))

    frames = []
    num_frames = 50

    for i in range(num_frames + 1):
        current_heights = [val * (i / num_frames) for val in data]

        if i == 0:
            second_faucet_shape['y1'] = 2500

        if i == 0:
            third_faucet_shape['y1'] = 2500

        if i == 0:
            first_faucet_shape['y1'] = 2500

        if i == 0:
            fourth_faucet_shape['y1'] = 2500

        if i == 0:
            fifth_faucet_shape['y1'] = 2500

        if i == 0:
            sixth_faucet_shape['y1'] = 2500

        if i == 0:
            seventh_faucet_shape['y1'] = 2500

        if i == 0:
            eighth_faucet_shape['y1'] = 2500

        if i == 0:
            ninth_faucet_shape['y1'] = 2500

        if i == num_frames:
            first_faucet_shape['y1'] = 0
            second_faucet_shape['y1'] = 0
            third_faucet_shape['y1'] = 0
            fourth_faucet_shape['y1'] = 0
            fifth_faucet_shape['y1'] = 0
            sixth_faucet_shape['y1'] = 0
            seventh_faucet_shape['y1'] = 0
            eighth_faucet_shape['y1'] = 0
            ninth_faucet_shape['y1'] = 0

        frame = go.Frame(
            data=[go.Bar(x=labels, y=current_heights, marker_color='cornflowerblue', width=0.8, hovertext=hover_text, hoverinfo='text')],
            name=str(i),
            layout=go.Layout(
                title="Water Availability in Different Regions",
                xaxis_title="Regions",
                yaxis_title="Liters per Capita per Day",
                xaxis=dict(showline=True, linewidth=2, linecolor='white', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
                yaxis=dict(showline=True, linewidth=2, linecolor='white', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
                template="plotly_white",
                barmode='overlay',
                shapes=initial_shapes + [third_faucet_shape] + [first_faucet_shape] + [second_faucet_shape] + [fourth_faucet_shape]+ [fifth_faucet_shape]+ [sixth_faucet_shape]+ [seventh_faucet_shape]+ [eighth_faucet_shape]+ [ninth_faucet_shape]
            )
        )
        frames.append(frame)

    fig = go.Figure(
        data=[go.Bar(x=labels, y=[0] * len(labels), marker_color='cornflowerblue', width=0.8, hovertext=hover_text, hoverinfo='text')],
        layout=go.Layout(
            title="Water Availability in Different Regions",
            xaxis_title="Regions",
            yaxis_title="Liters per Capita per Day",
            xaxis=dict(showline=True, linewidth=2, linecolor='white', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='white', showgrid=False),
            yaxis=dict(showline=True, linewidth=2, linecolor='white', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='white', showgrid=False),
            template="plotly_white",
            barmode='overlay',
            plot_bgcolor='#27293D',  # Set plot background color
            paper_bgcolor='#27293D',
            font=dict(color='white'),
            shapes=initial_shapes
        ),
        frames=frames
    )

    fig.update_traces(hoverlabel=dict(bgcolor="white"))

    fig.update_layout(
        updatemenus=[
            {
                "buttons": [
                    {
                        "args": [None, {"frame": {"duration": 50, "redraw": True}, "fromcurrent": True}],
                        "label": "Turn on the faucets",
                        "method": "animate"
                    },
                    {
                        "args": [[None], {"frame": {"duration": 0, "redraw": True}, "mode": "immediate", "transition": {"duration": 0}}],
                        "label": "Turn off the faucets",
                        "method": "animate"
                    }
                ],
                "direction": "left",
                "pad": {"r": 10, "t": 87},
                "showactive": True,
                "type": "buttons",
                "x": 0.5,
                "xanchor": "center",
                "y": 0,
                "yanchor": "top",
                "bgcolor": "#27293D",  # Background color of the button
                "bordercolor": "cornflowerblue",  # Border color of the button
                "font": {"color": "cornflowerblue"}  # Text color of the button
                
            }
        ]
    )

    fig_json = pio.to_json(fig)
    return jsonify(fig_json)

@app.route('/toilet_plot')
def toilet_plot():
    categories = ['Global Standard for Emergencies', 'Gaza & Rafah']
    values1 = [20]
    values2 = [850]

    # Combine data into a single list
    combined_categories = categories * 2
    combined_values = values1 + values2

    # Create a bar chart
    fig = go.Figure()

    # Add bar trace
    fig.add_trace(go.Bar(
        x=categories,
        y=values1 + values2,
        hoverinfo='text',  # Show custom text in hover labels
        hovertext=[
            'Global Standard: 1 Toilet per 20 People',
            'Gaza, Rafah: 1 Toilet per 850 People'
        ],  # Custom text for hover labels
        marker=dict(color=['red', 'cornflowerblue'])  # Assign different colors to bars
    ))

    # Update layout
    fig.update_layout(
        title=dict(
            text='Unsanitary toilet Situation in Gaza and Rafah',
            font=dict(size=20, color='white')  # Update title font size and color
        ),
        xaxis_title=dict(
            text='Toilet',
            font=dict(size=18, color='white')  # Update x-axis title font size and color
        ),
        yaxis_title=dict(
            text='Number of People',
            font=dict(size=18, color='white')  # Update y-axis title font size and color
        ),
        plot_bgcolor='#27293D',  # Change background color of the plot area
        paper_bgcolor='#27293D',  # Change background color of the entire figure
        font=dict(size=12, color='white'),  # Update overall font color
        legend=dict(
            x=0.7,  # Adjust x position of legend
            y=0.95,  # Adjust y position of legend
            xanchor='left',  # Anchor legend to left
            yanchor='bottom',  # Anchor legend to top
            orientation='h',
            bgcolor='rgba(255, 255, 255, 0)',
            bordercolor='white',
            borderwidth=2,
            font=dict(size=14)  # Update legend font size
        ),
        xaxis=dict(
            showline=True,
            linewidth=2,
            linecolor='white',  # Update x-axis line color to ensure visibility
            showticklabels=True,
            tickfont=dict(size=16, color='white'),  # Update tick font size and color
            ticks="outside",
            tickwidth=2,
            tickcolor='white',  # Update tick color to ensure visibility
            tickvals=[0, 1],  # Position ticks in the middle of each bar
            ticktext=['Global Standard for Emergencies', 'Gaza'],
            tickmode='array',
            title_standoff=10  # Adjust the distance of the x-axis title from the axis
        ),
        yaxis=dict(
            showline=True,
            linewidth=2,
            linecolor='white',  # Update y-axis line color to ensure visibility
            showticklabels=True,
            tickfont=dict(size=16, color='white'),  # Update tick font size and color
            ticks="outside",
            tickwidth=2,
            tickcolor='white',  # Update tick color to ensure visibility
            range=[0, 900],  # Set y-axis range from 0 to 900
            title_standoff=10,  # Adjust the distance of the y-axis title from the axis
            showgrid=False  # Remove horizontal grid lines
        )
    )

    # Update hover label background color
    fig.update_traces(
        hoverlabel=dict(
            bgcolor="white"
        )
    )

    fig_json = pio.to_json(fig)
    return jsonify(fig_json)

if __name__ == '__main__':
    app.run(debug=True)
